import { resources } from './src/resources.js';

// Create a 2d context
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const draw = () => {
  // Draw the ocean background
  const water = resources.images.water; 

  if (water.isLoaded) {
    const ocean = ctx.createPattern(water.image, 'repeat');

    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
  
  // Draw the map
  const genus = resources.images.genus;
   
  if (genus.isLoaded) {
    ctx.drawImage(genus.image, (canvas.width - 1024) / 2, (canvas.height - 512) / 2);
  };
};

setTimeout(() => {
  draw()
}, 300);