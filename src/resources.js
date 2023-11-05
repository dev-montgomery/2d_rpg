class Resources {
  constructor() {
    // Retrieve all map JSON
    this.mapsToLoad = {
      genus01: './assets/map_data/genus/genus_01.json',
      // genus02: './assets/map_data/genus/genus_02.json',
    };

    this.spritesheet = new Image();
    this.spritesheet.src = './assets/spritesheet-genus.png';

    // Resource bucket of json data
    this.mapData = {};

    // Fetch and load json map data
    Object.keys(this.mapsToLoad).forEach(key => {
      fetch(this.mapsToLoad[key])
      .then(response => {
        if (!response.ok) {
          throw new Error('404 json response');
        }
        return response.json();
      })
      .then(data => {
        this.mapData[key] = data;
        console.log(this.mapData[key])
      })
      .catch(error => {
        console.error('Fetch error', error);
      });      
    });
  };
};

export const resources = new Resources();