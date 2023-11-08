class Resources {
  constructor() {
    // Retrieve all map json
    this.mapsToLoad = {
      genus01: './assets/map_data/genus/genus_01.json',
      // genus02: './assets/map_data/genus/genus_02.json',
    };

    this.spritesheet = new Image();
    this.spritesheet.src = './assets/spritesheet-genus.png';
    this.spritesheet.width = 20; 
    this.frameSize = 32;
    this.spritesheet.onload = () => {
      this.isLoaded = true;
    };

    // Resource bucket of json data
    this.mapData = {};

    // Fetch and load json into mapData
    Object.keys(this.mapsToLoad).forEach(key => {
      fetch(this.mapsToLoad[key])
      .then(response => {
        if (!response.ok) {
          throw new Error('404 json');
        }
        return response.json();
      })
      .then(data => {
        this.mapData[key] = data;
      })
      .catch(error => {
        console.error('Fetch error', error);
      });      
    });
  };

  // Create the ocean
  ocean = (ctx, canvas) => {
    const generateRandomOceanTiles = (min, max) => {
      const oceanTilesLocationOnSpriteSheet = [
        this.frameSize * 0,
        this.frameSize * 1, 
        this.frameSize * 2, 
        this.frameSize * 3, 
        this.frameSize * 4, 
        this.frameSize * 5, 
        this.frameSize * 6, 
        this.frameSize * 7, 
        this.frameSize * 8
      ];
      return oceanTilesLocationOnSpriteSheet[Math.floor((Math.random() * (max - min)) + min)];
    };
    
    for (let dy = 0 ; dy < canvas.height ; dy+= this.frameSize) {
      for (let dx = 0 ; dx < canvas.width ; dx+= this.frameSize) {
        this.isLoaded && ctx.drawImage(
          resources.spritesheet,
          generateRandomOceanTiles(0, 5), // source x 0 - 128
          generateRandomOceanTiles(6, 9), // source y 192 - 256
          this.frameSize, // source width
          this.frameSize, // source height
          dx, // where to draw
          dy,
          this.frameSize, // draw this size width
          this.frameSize // draw this size height
        );
      };
    }
  };
  
  // Create current map
  createMap = (ctx, currentMap = this.mapData.genus01.layers) => {
    currentMap.forEach(layer => {
      let dx = 0, dy = 0
      
      layer.data.forEach(tileID => {
        if (tileID > 0) {
          let sx = tileID - 1, sy = 0;
          
          if (sx > this.spritesheet.width) {
            sx = (sx % this.spritesheet.width);
            sy = Math.floor(tileID / this.spritesheet.width);
          };
          
          this.isLoaded && ctx.drawImage(
            this.spritesheet,
            sx * this.frameSize,
            sy * this.frameSize,
            this.frameSize,
            this.frameSize,
            dx * this.frameSize,
            dy * this.frameSize,
            this.frameSize,
            this.frameSize
          );  
        };
  
        if (dx === 49) {
          dy++;
          dx = -1;
        };

        dx++;
      });
    });
  };
};

// make map larger
// create collision areas
// map change

// depot box function
// mailbox function
// npcs
// stairs
// fishing

export const resources = new Resources();