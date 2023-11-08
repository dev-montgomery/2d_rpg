import { resources } from './src/resources.js';
import { Player } from './src/Player.js';

// Create a 2d context
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// Map Size is 50 x 30 frames | 32 pixels per frame
canvas.width = innerWidth;
canvas.height = innerHeight;

const player = new Player();

const keys = {
  right: { pressed: false },
  left: { pressed: false },
  up: { pressed: false }
};

setTimeout(() => {
  resources.ocean(ctx, canvas);
  resources.createMap(ctx);
  player.update(ctx)
}, 300)

// function animate () {
//   requestAnimationFrame(animate);
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   resources.ocean(ctx, canvas);
//   resources.createMap(ctx);
//   player.draw(ctx);
// }

// animate();