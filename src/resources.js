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
  
  // Create current map
  createMap = (ctx, currentMap = this.mapData.genus01.layers) => {
    for (let layer = 0 ; layer < currentMap.length ; layer++) {
      const layerData = currentMap[layer].data;
      
      for (let tile = 0, dy = 0, dx = 0 ; tile < layerData.length ; tile++, dx++) {
        const tileID = layerData[tile];
        
        if (tileID > 0) {
          let sx = tileID, sy = 0;
          
          if (sx > this.spritesheet.width) {
            sx = (sx % this.spritesheet.width) - 1;
            sy = Math.floor(tileID / this.spritesheet.width);
          } else {
            sx--;
          };
          
          ctx.drawImage(
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
      };
    };
  };
};

export const resources = new Resources();