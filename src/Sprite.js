export class Sprite {
  constructor({
    sprite,  // image of sprite
    sx, // x location on spritesheet
    sy, // y location on spritesheet
    sWidth, // original width
    sHeight, // original height
    dx, 
    dy,
    dWidth,
    dHeight,
    frame, // the current frame
  }) {
    this.sprite = sprite;
    this.sx = sx ?? 0;
    this.sy = sy ?? 0;
    this.dx = dx ?? 0;
    this.dy = dy ?? 0;
    this.dWidth = dWidth ?? 32;
    this.dHeight = dHeight ?? 32;
    this.sWidth = sWidth ?? 32;
    this.sHeight = sHeight ?? 32;
    this.frame = frame ?? 0;
  }

  drawImage(ctx, x, y) {
    if (!this.resource.isLoaded) {
      return;
    }

    // locate the exact frame to use
    ctx.drawImage(
      this.sprite, 
      0, 
      0,
      32,
      32
    )
  }
};

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

// const generateMap = (currentArea = resources.mapData.genus01.layers) => {
  // console.log(currentArea)
  // for (let layer = 0 ; layer < currentArea.length ; layer++) {
    // let dx = 0, dy = 0;
    
    // for (let tileNumber = 0 ; tileNumber < currentArea[layer].data.length ; tileNumber++) {
      // const tile = currentArea[layer].data[tileNumber];
      // if (tile)
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
    // }
  // }
// }

// setInterval(() => {
//   drawOcean();
// }, 2000)

// drawOcean();
// generateMap();