import { resources } from './src/resources.js';

// Create a 2d context
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// Map Size is 50 x 30 frames | 32 pixels per frame
canvas.width = 50 * 32;
canvas.height = 30 * 32;
 
setTimeout(() => {
  resources.createMap(ctx);
}, 300)

// function animate () {
//   requestAnimationFrame(animate());
//   console.log('go')
//   resources.createMap(ctx);
// }