import { resources } from './src/resources.js';
import { Sprite } from './src/Classes.js';

// Create canvas and context
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1920;
canvas.height = 1920;

// ------ eventually use own fantasy background image
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const screen = {};
screen.width = innerWidth;
screen.height = innerHeight;

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
  destination: { dx: (screen.width/2) - 16, dy: (screen.height/2) - 16 }
});

const initPlayerData = e => {
  e.preventDefault();
  const playerName = document.getElementById('login-form-input').value;

  player.data = resources.createPlayer(playerName);

  // ------ eventually style smoother transition
  form.style.display = 'none';
  form.closed = true;
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
genus.src = './backend/assets/genus-map-resources.png';
genus.pixelSize = 32;
genus.spritesheetWidth = 25;
genus.onload = () => {
  genus.loaded = true;
};

const drawGenus = (currentMap = resources.mapData.isLoaded && resources.mapData.genus01.layers) => {
  currentMap.forEach(layer => {
    layer.data.forEach((tileID, i) => {
      if (tileID > 0) {
        const sx = (tileID - 1) % genus.spritesheetWidth * genus.pixelSize;
        const sy = Math.floor((tileID - 1) / genus.spritesheetWidth) * genus.pixelSize;
        const dx = i % 40 * genus.pixelSize;
        const dy = Math.floor(i / 40) * genus.pixelSize;
        
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

function animate () {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  form.closed && genus.loaded && drawGenus();
  form.closed && player.draw(ctx);  
};

animate();
 
const directions = {
  up: { pressed: false },
  down: { pressed: false },
  left: { pressed: false },
  right: { pressed: false }
};

const chatbox = false;
let lastKeyPressed = '';

// Event Listeners for player mobility
addEventListener('keydown', (e) => {
  // if (lastKeyPressed === e.key) 
  if (form.closed && !chatbox) {
    switch(e.key) {
      case 'w' :
        directions.up.pressed = true;
        lastKeyPressed = 'w';
        player.direction = player.origin.upward;
        break;
      case 's' :
        directions.down.pressed = true;
        lastKeyPressed = 's';
        player.direction = player.origin.downward;
        break;
      case 'a' :
        directions.left.pressed = true;
        lastKeyPressed = 'a';
        player.direction = player.origin.leftward;
        break;
      case 'd' :
        directions.right.pressed = true;
        lastKeyPressed = 'd';
        player.direction = player.origin.rightward;
        break;
      default: break;
    };
  };
});

addEventListener('keyup', (e) => {
  if (form.closed && !chatbox) {
    switch(e.key) {
      case 'w' :
        directions.up.pressed = false;
        break;
      case 's' :
        directions.down.pressed = false;
        break;
      case 'a' :
        directions.left.pressed = false;
        break;
      case 'd' :
        directions.right.pressed = false;
        break;
      default: break;
    };
  };
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