export class Resources {
  constructor() {
    this.mapJsonToLoad = {
      genus01: './assets/map_data/genus/genus_01.json',
      // genus02: './assets/map_data/genus/genus_02.json',
    };

    // Resource bucket of map json data
    this.mapData = {};

    Object.keys(this.mapJsonToLoad).forEach(key => {
      fetch(this.mapJsonToLoad[key])
      .then(response => {
        if (!response.ok) {
          throw new Error('Fetch map json error');
        }
        return response.json();
      })
      .then(data => {
        this.mapData[key] = data;
        this.mapData.isLoaded = true;
      })
      .catch(error => {
        console.error('Error loading map json', error);
      });      
    });

    // Load Player | Create Player
    this.loadPlayerData();
  };  

  loadPlayerData() {
    fetch('./assets/player_data/player.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Fetch player json error');
      }
      return response.json();
    })
    .then(data => {
      this.playerData = data;
      this.playerData.isLoaded = true;
    })
    .catch(error => {
      console.error('Error loading player json', error);
    });
  };

  playerExists(playername) {
    return this.playerData.some(player => player.name === playername);
  };

  createPlayer(playername) {
    if (this.playerExists(playername)) {
      console.log(`Player ${playername} already exists`);
      return null;
    };

    const newPlayer = {
      id: this.playerData.length + 1,
      name: playername
    };

    this.playerData.push(newPlayer);

    console.log(`${playername} created`)
    return newPlayer;
  };
};

export const resources = new Resources();