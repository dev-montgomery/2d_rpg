class Resources {
  constructor() {
    // Everything to upload
    this.toLoad = {
      water: './assets/water.png',
      genus: './assets/genus.png'
    };
    
    // Resources bucket of images
    this.images = {};

    // Load each image
    Object.keys(this.toLoad).forEach(key => {
      const img = new Image();
      img.src = this.toLoad[key];
      this.images[key] = {
        image: img,
        isLoaded: false
      };
      img.onload = () => {
        this.images[key].isLoaded = true;
      };
    });
  };
};

// Instantiate resources
const resources = new Resources();

// Create a 2d context
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const draw = () => {
  // Draw the ocean background and map
  const ocean = ctx.createPattern(resources.images.water.image, 'repeat');
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  console.log('water')

  const genus = resources.images.genus;
  ctx.drawImage(genus.image, (canvas.width - 1024) / 2, (canvas.height - 512) / 2);
}

setTimeout(() => {
  draw()
}, 300)