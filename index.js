import { resources } from './src/resources.js';
import { Sprite } from './src/Sprite.js';

// Create a 2d context
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const frameSize = 32;
canvas.width = 68 * frameSize;
canvas.height = 30 * frameSize;

// Draw the map
const draw = () => {
  // Create the Ocean First
  const drawOcean = () => {
    const generateRandomOceanTiles = (min, max) => {
      const oceanTiles = [frameSize * 0,frameSize *  1, frameSize * 2, frameSize * 3, frameSize * 4, frameSize * 5, frameSize * 6, frameSize * 7, frameSize * 8];
  
      return oceanTiles[Math.floor((Math.random() * (max - min)) + min)]
    };
    
    for (let y = 0 ; y < canvas.height ; y+= frameSize) {
      for (let x = 0 ; x < canvas.width ; x+= frameSize) {
        ctx.drawImage(
          resources.spritesheet,
          generateRandomOceanTiles(0, 5), // source x 0 - 128
          generateRandomOceanTiles(6, 9), // source y 192 - 256
          frameSize, // source width
          frameSize, // source height
          x, // where to draw
          y,
          frameSize, // draw this size width
          frameSize // draw this size height
        );
      };
    }
  };

  // Generate Map
  // const findTileInSpritesheet = (tileNumber) => {
  //   const spritesheetWidth = 20;
    
  //   let row = 0;
  //   let remainder = tileNumber;

  //   if (tileNumber > spritesheetWidth) {
  //     row = Math.floor(tileNumber / spritesheetWidth);
  //     remainder = tileNumber % spritesheetWidth;
  //   };

  //   let sx = remainder === 0 ? 0 : (remainder - 1) * 32;
  //   let sy = row * 32;
  //   return [sx, sy];
  // }
  
  const generateMap = (currentArea = resources.mapData.genus01.layers) => {
    console.log(currentArea)
    for (let layer = 0 ; layer < currentArea.length ; layer++) {
      // let dx = 0, dy = 0;
      
      for (let tileNumber = 0 ; tileNumber < currentArea[layer].data.length ; tileNumber++) {
        const tile = currentArea[layer].data[tileNumber];
        if (tile)
        // let sy = 0, sx = tile;
        
        // if (tile > resources.spritesheet.width) {
        //   sy = Math.floor(tile / resources.spritesheet.width);
        //   sx = tile % resources.spritesheet.width;
        // };

        // if (dx === 20) {
        //   dx = 0;
        //   dy++;
        // }
        // sx = sx === 0 ? 0 : sx - 1;
        
        // ctx.drawImage(
        //   resources.spritesheet,
        //   sx * frameSize,
        //   sy * frameSize,
        //   frameSize,
        //   frameSize,
        //   dx,
        //   dy,
        //   frameSize,
        //   frameSize
        //   )
        //   dx += frameSize;
      }
    }
  }

  // setInterval(() => {
  //   drawOcean();
  // }, 2000)

  drawOcean();
  generateMap();
};

setTimeout(() => {
  draw()
}, 300);