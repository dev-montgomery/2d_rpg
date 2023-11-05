import { resources } from './src/resources.js';
import { Sprite } from './src/Sprite.js';

// Create a 2d context
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 2500;
canvas.height = 1700;

// Draw the map
// const area = Object.keys(resources.mapsToLoad)
const updateMap = () => {
  let currentArea = resources.mapData.genus01.layers
  console.log(currentArea)
  currentArea.forEach(tileLayer => {
    tileLayer.data.forEach(tile => {
      console.log(tile)
      // ctx.drawImage(
      //   resources.spritesheet,
      //   sx,
      //   sy,
      //   32,
      //   32,
      //   dx,
      //   dy,
      //   50,
      //   50
      // )
    })
  })


}

const draw = () => {
  // Draw the ocean background
  for (let y = 0 ; y < canvas.height ; y+= 149) {
    for (let x = 0 ; x < canvas.width ; x+= 249) {
      ctx.drawImage(
        resources.spritesheet,
        0, // source x
        192, // source y
        32 * 5, // source width
        32 * 3, // source height
        x, // where to draw
        y,
        50 * 5, // draw this size width
        50 * 3 // draw this size height
      );
    };
  };

  updateMap();
};

setTimeout(() => {
  draw()
}, 300);