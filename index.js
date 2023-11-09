import { resources } from './src/Resources.js';
import { Player } from './src/Player.js';

// Create a 2d context
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// Map Size is 50 x 30 frames | 32 pixels per frame
canvas.width = innerWidth;
canvas.height = innerHeight;

// Generate the map... starting with a lame shimmering ocean
let lastShimmerRender = 201;
const shimmerInterval = 200;

const createOcean = () => {
  lastShimmerRender += 1;

  const randomTile = (min, max) => {
    const tiles = [0, 32, 64, 96, 128, 160, 192, 224, 256];
    return tiles[Math.floor((Math.random() * (max - min)) + min)];
  };
  
  if (lastShimmerRender > shimmerInterval) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let dy = 0 ; dy < canvas.height ; dy+= 32) {
      for (let dx = 0 ; dx < canvas.width ; dx+= 32) {
        resources.mapData.isLoaded && ctx.drawImage(
          resources.spritesheet,
          randomTile(0, 5), // source x 0 - 128
          randomTile(6, 9), // source y 192 - 256
          resources.frameSize, // source width
          resources.frameSize, // source height
          dx, // where to draw
          dy,
          resources.frameSize, // draw this size width
          resources.frameSize // draw this size height
        );
      };
    }
    lastShimmerRender = 0;
  }
};

// Create the current map
const createMap = (currentMap = resources.mapData.genus01.layers) => {
  currentMap.forEach(layer => {
    let dx = 0, dy = 0
    
    layer.data.forEach(tileID => {
      if (tileID > 0) {
        let sx = tileID - 1, sy = 0;

        if (sx > resources.spritesheet.width) {
          sx = (sx % resources.spritesheet.width);
          sy = Math.floor(tileID / resources.spritesheet.width);
        };
        
        resources.isLoaded && ctx.drawImage(
          resources.spritesheet,
          sx * resources.frameSize,
          sy * resources.frameSize,
          resources.frameSize,
          resources.frameSize,
          dx * resources.frameSize,
          dy * resources.frameSize,
          resources.frameSize,
          resources.frameSize
        );  
      };

      if (dx === 49) {
        dy++;
        dx = -1;
      };

      dx++;
    });
  });
};

const player = new Player();

const keys = {
  right: { pressed: false },
  left: { pressed: false },
  up: { pressed: false },
  down: { pressed: false}
};

function animate () {
  requestAnimationFrame(animate);
  if (resources.mapData.isLoaded) {
    createOcean();
    createMap();
  }
  player.update(ctx);
}

animate();


// player movement
// make player center of screen
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
// determine skills and lvl algorythems
// learn how to spell algorithyms