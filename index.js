import { resources } from './src/resources.js';
import { Sprite } from './src/Sprite.js';

// Create a 2d context
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const zones = Object.keys(resources.zone);
const spritesheet = new Image();
spritesheet.src = './assets/spritesheet-genus.png';

const draw = () => {
  // Draw the ocean background
  for (let y = 0 ; y < canvas.height ; y+= 96) {
    for (let x = 0 ; x < canvas.width ; x+= 160) {
      ctx.drawImage(
        spritesheet,
        0, // source x
        193, // source y
        161, // source width
        96, // source height
        x, // where to draw
        y,
        192, // draw this size width
        160 // draw this size height
      );
    };
  };

  // Draw the map
  console.log(zones)
  console.log(resources.mapData.genus01.layers)

};

setTimeout(() => {
  draw()
}, 300);