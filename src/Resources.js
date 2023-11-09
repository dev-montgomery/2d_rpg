export class Resources {
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
        this.mapData.isLoaded = true;
      })
      .catch(error => {
        console.error('Fetch error', error);
      });      
    });
  };  
};

export const resources = new Resources();