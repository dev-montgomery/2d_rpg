export class Resources {
  constructor() {
    this.mapJsonToLoad = {
      // starting area:
      genus01: './backend/assets/map_data/genus/genus_01.json',
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

    this.loadPlayerData();
    this.fetchItemData();
  };  
  
  // Load Player | Create Player
  loadPlayerData() {
    fetch('./backend/assets/player_data/player.json')
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
    return this.playerData.playerlist.some(player => player.name === playername);
  };

  createPlayer(playername) {
    if (this.playerExists(playername)) {
      console.log(`Logged in as ${playername}.`);
      const returningPlayer = this.playerData.playerlist.find(player => player.name === playername);
      return returningPlayer;
    };

    const newPlayer = {
      id: this.playerData.playerlist.length + 1,
      name: playername,
      performance: this.playerData.newplayer
    };
    
    this.playerData.playerlist.push(newPlayer);
    console.log(`${playername} created.`)
    // console.log(`Logged in as ${playername}.`);
    return newPlayer;
  };

  // Fetch all json item data from backend
  fetchItemData() {
    fetch('./backend/assets/item_data/items.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Fetch item data json error');
      }
      return response.json();
    })
    .then(data => {
      this.itemData = data;
      this.itemData.isLoaded = true;
    })
    .catch(error => {
      console.error('Error loading item data json', error);
    });
  };
};

export const resources = new Resources();