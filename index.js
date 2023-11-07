import { resources } from './src/resources.js';
import { Sprite } from './src/Sprite.js';

// Create a 2d context
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const frameSize = 32;
canvas.width = 50 * frameSize;
canvas.height = 30 * frameSize;

// Draw something... a map... doit
const draw = () => {
  const generateMap = (currentMap = resources.mapData.genus01.layers) => {
    
    for (let layer = 0 ; layer < currentMap.length ; layer++) {
      const layerData = currentMap[layer].data;
      
      for (let tile = 0, dy = 0, dx = 0 ; tile < layerData.length ; tile++, dx++) {
        const tileID = layerData[tile];
        if (tileID > 0) {
          let sx = tileID, sy = 0;
          
          if (sx > resources.spritesheet.width) {
            sx = (sx % resources.spritesheet.width) - 1;
            sy = Math.floor(tileID / resources.spritesheet.width);
          } else {
            sx--;
          };
          
          ctx.drawImage(
            resources.spritesheet,
            sx * frameSize,
            sy * frameSize,
            frameSize, // source width
            frameSize, // source height
            dx * frameSize, // where to draw
            dy * frameSize,
            frameSize, // draw this size width
            frameSize // draw this size height
          );  
        };

        if (dx === (canvas.width / frameSize) - 1) {
          dy++;
          dx = -1;
        };
      };
    };
  };
  generateMap();
};

setTimeout(() => {
  draw()
}, 300);