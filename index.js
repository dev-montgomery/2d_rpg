import { resources } from './src/resources.js';
import { Tile, Sprite } from './src/Classes.js';

window.addEventListener('load', (event) => {

  // Create canvas and context
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.frames = { row: 11, col: 13 };
  canvas.width = 832; // 6.5 squares on each side of player
  canvas.height = 704; // 5 up and down
  
  // Temp Background
  const bg = new Image();
  bg.src = './backend/assets/east_oasis.png';
  canvas.style.backgroundImage = `url(${bg.src})`;
  canvas.style.backgroundRepeat = 'no-repeat';
  canvas.style.backgroundSize = 'cover';
  document.body.style.backgroundColor = '#336c97';
  const changeBorder = (element) => {
    element.style.border = '1px solid black';
  };

  // ------ eventually implement chatbox to interact with npcs
  const chatbox = false;

  // Handle form to create and/or "login" as existing player
  const form = document.querySelector('.form-container');
  form.closed = false;

  const player = new Sprite({
    source: {
      downward: { sx: 0, sy: 0 },
      upward: { sx: 64, sy: 0 },
      rightward: { sx: 128, sy: 0 },
      leftward: { sx: 192, sy: 0 }
    },
    destination: {
      dx: canvas.width * 0.5 - 48, // offset player
      dy: canvas.height * 0.5 - 48 // offset player
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
      changeBorder(canvas);
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
    updatePlayerData(); // need to fix 
  });
  
  // Populate the background and map
  const genus = new Image();
  genus.src = './backend/assets/map_data/genus-resources-64.png';
  genus.pixelSize = 64;
  genus.spritesheetWidth = 25;
  genus.mapSize = { row: 160, col: 140 };
  genus.onload = () => {
    genus.loaded = true;
  };

  // Bucket of Boundaries
  let boundaries = [];
  
  // Draw map, takes in player coordinates and JSON data
  const drawGenus = ({ player }, currentMap = resources.mapData.isLoaded && resources.mapData.genus01.layers) => {
    boundaries = [];
    // Use location of player to identify upper left corner to begin drawing. 13 x 11 tiles.
    const startingTile = { 
      x: player.mapLocation.mx - Math.floor(canvas.frames.col/2), // 6.5 left
      y: player.mapLocation.my - Math.floor(canvas.frames.row/2) // 5.5 up
    };
    
    // Create minimap of player location
    const minimap = [], uppermost = [];
    currentMap.forEach(layer => {
      startingTile.num = genus.mapSize.col * (startingTile.y - 1) + startingTile.x;
      let tiles = []; 
      for (let i = 0 ; i < canvas.frames.row ; i++) {
        tiles.push(...layer.data.slice(startingTile.num, startingTile.num + canvas.frames.col));
        startingTile.num += genus.mapSize.col;
      };
      minimap.push(tiles);
    });
  
    // Iterate through minimap to draw tiles
    minimap.forEach(layer => {
      layer.forEach((tileID, i) => {
        if (tileID > 0) {
          const sx = (tileID - 1) % genus.spritesheetWidth * genus.pixelSize; // finds x-axis px on spritesheet
          const sy = Math.floor((tileID - 1) / genus.spritesheetWidth) * genus.pixelSize; // determines row on spritesheet
          const dx = i % canvas.frames.col * genus.pixelSize;
          const dy = Math.floor(i / canvas.frames.col) * genus.pixelSize;
          
          // Bucket of uppermost tiles
          const upperTiles = [ 576, 577, 578, 579, 580, 581, 582, 601, 602, 603, 604, 605, 606, 607, 608 ];
          
          // Check for collision tiles
          if (tileID === 25) { 
            const boundary = new Tile({
              destination: {
                bdx: dx, 
                bdy: dy
              }
            });
            boundaries.push(boundary);

          // Collect uppermost tiles
          } else if (upperTiles.includes(tileID)) {
            const upper = new Tile({
              source: {
                usx: sx,
                usy: sy
              },
              destination: {
                udx: dx, 
                udy: dy
              }
            });
            upper.tileID = tileID;
            uppermost.push(upper);

          } else {
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
        };
      });
    });
    // Draw player after drawing minimap
    player.draw(ctx);
    // Draw uppermost layer
    uppermost.forEach(tile => {
      ctx.drawImage(
        genus,
        tile.source.usx,
        tile.source.usy,
        tile.pixelSize,
        tile.pixelSize,
        tile.destination.udx,
        tile.destination.udy,
        tile.pixelSize,
        tile.pixelSize
      );
    });
  };

  // Collision Detection
  const collisionDetect = (newX, newY) => {
    for (let i = 0 ; i < boundaries.length ; i++) {
      const boundary = boundaries[i];
      if (
        newX < boundary.destination.bdx + boundary.pixelSize &&
        newX + player.pixelSize > boundary.destination.bdx &&
        newY < boundary.destination.bdy + boundary.pixelSize &&
        newY + player.pixelSize > boundary.destination.bdy
      ) {
        return true;
      };
    };
  };
  
  // Implement Player Movement | event listeners for player movement and collision
  addEventListener('keydown', (e) => {
    let newX = player.destination.dx + player.offset;
    let newY = player.destination.dy + player.offset;
    let valX = 0;
    let valY = 0;

    if (form.closed && !chatbox && !player.cooldown) {
      switch(e.key) {
        case 'w' :
          player.direction = player.source.upward;
          newY -= player.pixelSize;
          valY--;
          break;
          
        case 's' :
          player.direction = player.source.downward;
          newY += player.pixelSize;
          valY++;
          break;
          
        case 'a' :
          player.direction = player.source.leftward;
          newX -= player.pixelSize;
          valX--;
          break;
          
        case 'd' :
          player.direction = player.source.rightward;
          newX += player.pixelSize;
          valX++;
          break;
          
        default: break;
      };

      if (!collisionDetect(newX, newY)) {
        player.mapLocation.mx += valX;
        player.mapLocation.my += valY;
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