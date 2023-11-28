import { resources } from './src/resources.js';
import { Boundary, Sprite } from './src/Classes.js';

window.addEventListener('load', (event) => {

  // Create canvas and context
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  
  // Screen size for high-dpi displays - Probably unnecessary but seems fine to havd
  const scaleFactor = window.devicePixelRatio;
  canvas.width = 832 * scaleFactor;
  canvas.height = 704 * scaleFactor;
  ctx.scale(scaleFactor, scaleFactor);
  
  // Temp Background
  const bg = new Image();
  bg.src = './backend/assets/east_oasis.png';
  document.body.style.backgroundImage = `url(${bg.src})`;
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundSize = 'cover';
  
  // ------ eventually implement chatbox to interact with npcs
  const chatbox = false;

  // Handle form to create and/or "login" as existing player
  const form = document.querySelector('.form-container');
  form.closed = false;

  const player = new Sprite({
    origin: {
      downward: { sx: 0, sy: 0 },
      upward: { sx: 0, sy: 32 },
      rightward: { sx: 32, sy: 0 },
      leftward: { sx: 32, sy: 32 }
    },
    destination: {
      dx: canvas.width * 0.5, 
      dy: canvas.height * 0.5
    }
  });
  
  const initPlayerData = e => {
    e.preventDefault();
    const playerName = document.getElementById('login-form-input').value;
  
    player.data = resources.createPlayer(playerName);
  
    // ------ eventually style smoother transition
    form.style.display = 'none';
    form.closed = true;

    // Render map and player after form is submitted
    setTimeout(() => {
      genus.loaded && drawGenus({ player });
      player.draw(ctx);
    }, 500);
  };
  
  document.getElementById('login-form').addEventListener('submit', initPlayerData);
  
  // POST player data to backend json file
  const updatePlayerData = async () => {
    const playerdata = resources.playerData;
    
    try {
      const response = await fetch('http://localhost:4000/playerdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playerdata)
      });
    
      const completed = await response.json();
    } catch(error) {
      console.error('Error saving player data.', error);
    };
  };
  // ------ will need to determine if player is in combat before logging out.
  // Saves player data when the browser window is closed.
  addEventListener('beforeunload', e => {
    e.preventDefault();
    resources.playerData.isLoaded = false;
    updatePlayerData(); 
  });
  
  // After player "login", populate the background and map
  const genus = new Image();
  genus.src = './backend/assets/map_data/genus/genus-map-resources-32.png';
  genus.pixelSize = 32;
  genus.spritesheetWidth = 25;
  genus.mapSize = { row: 80, col: 120 };
  genus.onload = () => {
    genus.loaded = true;
  };
  
  // Draw map, takes in player coordinates and JSON data
  // function to create local minimap
  const createMinimap = ({ player }, currentMap) => {
    const minimap = [];
    const startingTile = {};
    const screen = { width: 26, height: 22 };
    startingTile.x = player.position.x - screen.width/2;
    startingTile.y = player.position.y - screen.height/2;

    currentMap.forEach(layer => {
      startingTile.num = genus.mapSize.col * (startingTile.y - 1) + startingTile.x;
      let tiles = [];
      for (let i = 0 ; i < screen.height ; i++) {
        tiles.push(...layer.data.slice(startingTile.num, startingTile.num + 26));
        startingTile.num += genus.mapSize.col;
      };
      minimap.push(tiles);
    });
    
    return minimap;
  };

  const drawGenus = ({ player }, currentMap = resources.mapData.isLoaded && resources.mapData.genus01.layers) => {
    const minimap = createMinimap({ player }, currentMap);

    minimap.forEach(layer => {
      layer.forEach((tileID, i) => {
        if (tileID > 0) {
          const sx = (tileID - 1) % genus.spritesheetWidth * genus.pixelSize;
          const sy = Math.floor((tileID - 1) / genus.spritesheetWidth) * genus.pixelSize;
          const dx = i % 26 * genus.pixelSize;
          const dy = Math.floor(i / 26) * genus.pixelSize;

          ctx.drawImage(
            genus,
            sx,
            sy,
            genus.pixelSize,
            genus.pixelSize,
            dx,
            dy,
            genus.pixelSize,
            genus.pixelSize
            );
          };
      });
    });

    player.draw(ctx);
  };

  // Collision Detection
  const collisionCheck = ({ player }, currentMap = resources.mapData.isLoaded && resources.mapData.genus01.layers) => {
    const minimap = createMinimap({ player }, currentMap);
    const boundaries = [];

    minimap.forEach(layer => {
      layer.forEach((tileID, i) => {
        if (tileID > 0) {
          const dx = i % 26 * genus.pixelSize;
          const dy = Math.floor(i / 26) * genus.pixelSize;
          
          if (tileID === 167) {
            const boundary = new Boundary({
              position: {
                bx: dx, 
                by: dy
              }
            });
            boundaries.push(boundary);
          };
        };
      });
    });
  
    for (let i = 0 ; i < boundaries.length ; i++) {
      const boundary = boundaries[i];
      
      if (
        player.destination.dy + player.pixelSize >= boundary.position.by &&
        player.destination.dy <= boundary.position.by + boundary.pixelSize &&
        player.destination.dx <= boundary.position.bx + boundary.pixelSize &&
        player.destination.dx + player.pixelSize >= boundary.position.bx
      ) {
        return true;
      }
    };
    return false;
  };

  // Implement Player Movement | event listeners for player movement and collision
  addEventListener('keydown', (e) => {
    if (form.closed && !chatbox && !player.cooldown) {
      switch(e.key) {
        case 'w' :
          player.direction = player.origin.upward;
          player.position.y -= !collisionCheck({ player }) && 1;
          console.log(!collisionCheck({ player }))
          break;
        case 's' :
          player.direction = player.origin.downward;
          player.position.y += !collisionCheck({ player }) && 1;
          console.log(!collisionCheck({ player }))
          break;
        case 'a' :
          player.direction = player.origin.leftward;
          player.position.x -= !collisionCheck({ player }) && 1;
          console.log(!collisionCheck({ player }))
          break;
        case 'd' :
          player.direction = player.origin.rightward;
          player.position.x += !collisionCheck({ player }) && 1;
          console.log(!collisionCheck({ player }))
          break;
        default: break;
      };

      player.cooldown = true;
      setTimeout(() => {
        player.cooldown = false;
      }, player.speed);
    };

    // Redraw map and player when player moves
    form.closed && drawGenus({ player });  
  });

  // Game Loop Function
  // function animate () {
  //   requestAnimationFrame(animate);
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);
  // };
    
  // animate();
});
    
// addEventListener('resize', drawMap);

// refine player movement
// collision detection
// handle uppermost layer
// water animation
// stairs and holes

// make map larger

// user interface
// inventory functionality
// equipping items
// depot box function
// mailbox function
// trash function
// fishing function
// npcs/interaction/dialogue
// attack functions
// determine skills and lvl algorithms

// ----------------------------

// let lastShimmerInterval = 200;

// const drawOcean = () => {
//   // lastShimmerRender += 1;

//   const randomTile = (min, max) => {
//     const tiles = [0, 32, 64, 96, 128, 160, 192, 224, 256];
//     return tiles[Math.floor((Math.random() * (max - min)) + min)];
//   };
  
//   // if (lastShimmerRender > shimmerInterval) {
//     for (let dy = 0 ; dy < canvas.height ; dy+= 32) {
//       for (let dx = 0 ; dx < canvas.width ; dx+= 32) {
//         resources.mapData.isLoaded && ctx.drawImage(
//           resources.spritesheet,
//           randomTile(0, 5), // source x 0 - 128
//           randomTile(6, 9), // source y 192 - 256
//           resources.frameSize, // source width
//           resources.frameSize, // source height
//           dx, // where to draw
//           dy,
//           resources.frameSize, // draw this size width
//           resources.frameSize // draw this size height
//         );
//       };
//     }
//     // lastShimmerRender = 0;
//   // }
// };