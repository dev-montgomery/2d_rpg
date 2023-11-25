import { resources } from './src/resources.js';
import { Sprite } from './src/Classes.js';

window.addEventListener('load', (event) => {

  // Create canvas and context
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  
  // Screen size for high-dpi displays - Probably unnecessary but seems fine to havd
  const scaleFactor = window.devicePixelRatio;
  canvas.width = 832 * scaleFactor;
  canvas.height = 704 * scaleFactor;
  ctx.scale(scaleFactor, scaleFactor);
  
  // ------ eventually use fantasy background image
  
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
    destination: { dx: canvas.width * 0.5, dy: canvas.height * 0.5 }
  });
  
  const initPlayerData = e => {
    e.preventDefault();
    const playerName = document.getElementById('login-form-input').value;
  
    player.data = resources.createPlayer(playerName);
  
    // ------ eventually style smoother transition
    form.style.display = 'none';
    form.closed = true;
    setTimeout(() => {
      genus.loaded && drawGenus(player.position.x, player.position.y);
      player.draw(ctx);
    }, 500)
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
  genus.scale = 1;
  genus.onload = () => {
    genus.loaded = true;
  };
  
  // Draw map, takes in player coordinates and JSON data
  const drawGenus = (positionX, positionY, currentMap = resources.mapData.isLoaded && resources.mapData.genus01.layers) => {
    const startingTile = {};
    const screen = { width: 26, height: 22 };
    startingTile.x = positionX - screen.width/2;
    startingTile.y = positionY - screen.height/2;
    
    let minimap = [];
    currentMap.forEach(layer => {
      startingTile.num = genus.mapSize.col * (startingTile.y - 1) + startingTile.x;
      let tiles = [];
      for (let i = 0 ; i < screen.height ; i++) {
        tiles.push(...layer.data.slice(startingTile.num, startingTile.num + 26));
        startingTile.num += genus.mapSize.col;
      };
      minimap.push(tiles);
    });
    
    minimap.forEach(layer => {
      layer.forEach((tileID, i) => {
        if (tileID > 0) {
          const sx = (tileID - 1) % genus.spritesheetWidth * genus.pixelSize;
          const sy = Math.floor((tileID - 1) / genus.spritesheetWidth) * genus.pixelSize;
          const dx = i % 26 * genus.pixelSize * genus.scale;
          const dy = Math.floor(i / 26) * genus.pixelSize * genus.scale;
        
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
  };
  
  // Implement Player Movement
  const directions = {
    up: { pressed: false },
    down: { pressed: false },
    left: { pressed: false },
    right: { pressed: false }
  };
    
  const chatbox = false;
  // let lastKeyPressed = '';

  // Event Listeners for player movement
  addEventListener('keydown', (e) => {
    if (form.closed && !chatbox && !player.cooldown) {
      switch(e.key) {
        case 'w' :
          directions.up.pressed = true;
          player.direction = player.origin.upward;
          // lastKeyPressed = 'w';
        if (player.position.y > 11) player.position.y -= 1;
          break;
        case 's' :
          directions.down.pressed = true;
          player.direction = player.origin.downward;
          // lastKeyPressed = 's';
          if (player.position.y < (canvas.height - 11)) player.position.y += 1;
          break;
        case 'a' :
          directions.left.pressed = true;
          player.direction = player.origin.leftward;
          // lastKeyPressed = 'a';
          if (player.position.x > 11) player.position.x -= 1;
          break;
        case 'd' :
          directions.right.pressed = true;
          player.direction = player.origin.rightward;
          // lastKeyPressed = 'd';
          if (player.position.x < (canvas.width - 11)) player.position.x += 1;
          break;
        default: break;
      };

      player.cooldown = true;
      setTimeout(() => {
        player.cooldown = false;
      }, player.speed);
    };
    form.closed && drawGenus(player.position.x, player.position.y);
    form.closed && player.draw(ctx);  
  });
  
  // addEventListener('keyup', (e) => {
  //   if (form.closed && !chatbox) {
  //     switch(e.key) {
  //       case 'w' :
  //         directions.up.pressed = false;
  //         break;
  //       case 's' :
  //         directions.down.pressed = false;
  //         break;
  //       case 'a' :
  //         directions.left.pressed = false;
  //         break;
  //       case 'd' :
  //         directions.right.pressed = false;
  //         break;
  //       default: break;
  //     };
  //   };
  // });

  // Game Loop Function
  // function animate () {
  //   requestAnimationFrame(animate);
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   form.closed && genus.loaded && drawGenus(player.position.x, player.position.y);
  //   form.closed && player.draw(ctx);  

  //   if (directions.up.pressed && lastKeyPressed === 'w') {
  //     player.position.y--;
  //   } else if (directions.down.pressed && lastKeyPressed === 's') {
  //     player.position.y++;   
  //   } else if (directions.left.pressed && lastKeyPressed === 'a') {
  //     player.position.x--;
  //   } else if (directions.right.pressed && lastKeyPressed === 'd') {
  //     player.position.x++;
  //   };
    
  //  // need to add boundaries
  // };
    
  // animate();
});
    
  // addEventListener('resize', drawMap);

  // player movement
  // map update beyond axis
// create collision areas

// make map larger

// inventory functionality
// equipping items
// depot box function
// mailbox function
// trash function
// fishing function
// npcs
// stairs map update
// attack functions
// determine skills and lvl algorithms


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