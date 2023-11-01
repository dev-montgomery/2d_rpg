class Resources {
  constructor() {
    // Everything to upload
    this.toLoad = {
      water: './assets/water.png',
      genus: './assets/genus/genus_01.png'
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

export const resources = new Resources();