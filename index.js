import { resources } from './src/resources.js';
import { Player } from './src/Player.js';

// Create a 2d context
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// Map Size is 50 x 30 frames | 32 pixels per frame
canvas.width = innerWidth;
canvas.height = innerHeight;

const player = new Player();

setTimeout(() => {
  resources.ocean(ctx, canvas);
  resources.createMap(ctx);
  player.init(ctx)
}, 300)

// function animate () {
//   requestAnimationFrame(animate);
//   console.log('go')
//   resources.ocean(ctx, canvas);
//   resources.createMap(ctx);
// }

// animate();