import { resources } from './src/resources.js';
import { Item, Tile, Player } from './src/Classes.js';

window.addEventListener('load', (event) => {

  // Create canvas and context
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = 1024;
  canvas.height = 704;
  
  // Visible map
  const screen = {};
  screen.frames = { row: 11, col: 13 };
  screen.width = 832; // 6.5 squares on each side of player
  screen.height = 704; // 5 up and down

  // Temp Background
  const bg = new Image();
  bg.src = './backend/assets/east_oasis.png';
  canvas.style.backgroundImage = `url(${bg.src})`;
  canvas.style.backgroundRepeat = 'no-repeat';
  canvas.style.backgroundSize = 'cover';
  document.body.style.backgroundColor = '#336c97';

  // ------ eventually implement chatbox to interact with npcs
  const chatbox = false;

  // Init a player sprite
  const player = new Player({
    source: {
      downward: { sx: 0, sy: 0 },
      upward: { sx: 64, sy: 0 },
      rightward: { sx: 128, sy: 0 },
      leftward: { sx: 192, sy: 0 }
    },
    destination: {
      dx: screen.width * 0.5 - 48, // offset player
      dy: screen.height * 0.5 - 48 // offset player
    }
  });

  // Append Player Stats to Screen
  const appendPlayerStats = ({ player }) => {
    document.querySelector('#player-name').textContent = player.data.name;
    document.querySelector('#player-level').textContent = player.data.performance.lvls.lvl;
    document.querySelector('#player-magic-level').textContent = player.data.performance.lvls.mglvl;
    document.querySelector('#player-skill-fist').textContent = player.data.performance.skills.fist;
    document.querySelector('#player-skill-sword').textContent = player.data.performance.skills.sword;
    document.querySelector('#player-skill-axe').textContent = player.data.performance.skills.axe;
    document.querySelector('#player-skill-blunt').textContent = player.data.performance.skills.blunt;
    document.querySelector('#player-skill-distance').textContent = player.data.performance.skills.distance;
    document.querySelector('#player-skill-defense').textContent = player.data.performance.skills.defense;
    document.querySelector('#player-skill-fishing').textContent = player.data.performance.skills.fishing;
  };
  
  // Checks if player exists/Creates player | Close form
  const form = document.querySelector('.form-container');
  form.closed = false;
  
  const initPlayerData = (e) => {
    e.preventDefault();
    const playerName = document.getElementById('login-form-input').value;
  
    player.data = resources.createPlayer(playerName);
  
    // ------ eventually style smoother transition
    form.style.display = 'none';
    form.closed = true;

    // Render interface, map, and player after form is submitted
    setTimeout(() => {
      document.querySelector('.player-stats').style.display = 'flex';
      appendPlayerStats({ player });
      canvas.style.background = '#464646';
      genus.loaded && drawGenus({ player });
      player.draw(ctx);
    }, 500);
  };
  
  document.getElementById('login-form').addEventListener('submit', initPlayerData);

  // POST player data to backend json file
  const updatePlayerData = async () => {
    const playerToUpdate = resources.playerData.playerlist.findIndex(user => user.id === player.data.id);
    if (playerToUpdate !== -1) resources.playerData.playerlist[playerToUpdate] = player.data; 
    const playerdata = resources.playerData;

    try {
      const response = await fetch('http://localhost:3000/playerdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playerdata)
      });
    
      const completed = await response.json();
    } catch(error) {
      console.error('Error saving player data.', error);
    };
  };

  // ------ will need to determine if player is in combat before logging out.
  // Saves player data when the browser window is closed.
  addEventListener('beforeunload', e => {
    e.preventDefault();
    resources.playerData.isLoaded = false;
    updatePlayerData(); 
  });
  
  // Populate the background and map
  const genus = new Image();
  genus.src = './backend/assets/map_data/genus-resources-64.png';
  genus.pixelSize = 64;
  genus.spritesheetWidth = 25;
  genus.mapSize = { row: 160, col: 140 };
  genus.onload = () => {
    genus.loaded = true;
  };
  
  // Bucket of Boundaries
  const upperTiles = [ 576, 577, 578, 579, 601, 602, 603, 604 ];
  const waterTiles = [ 1, 2, 3, 4, 5, 6, 7, 8 ];
  let boundaries = [], wateries = [];
  
  // Draw map, takes in player coordinates and JSON data
  const drawGenus = ({ player }, currentMap = resources.mapData.isLoaded && resources.mapData.genus01.layers) => {
    boundaries = [];
    wateries = [];

    // Use location of player to identify upper left corner to begin drawing. 13 x 11 tiles.
    const startingTile = { 
      x: player.data.performance.location.x - Math.floor(screen.frames.col/2), // 6.5 left
      y: player.data.performance.location.y - Math.floor(screen.frames.row/2) // 5.5 up
    };

    // Create visibleMapSection of player location
    const visibleMapSection = [], uppermost = [];
    currentMap.forEach(layer => {
      startingTile.num = genus.mapSize.col * (startingTile.y - 1) + startingTile.x;
      let tiles = []; 
      for (let i = 0 ; i < screen.frames.row ; i++) {
        tiles.push(...layer.data.slice(startingTile.num, startingTile.num + screen.frames.col));
        startingTile.num += genus.mapSize.col;
      };
      visibleMapSection.push(tiles);
    });
  
    // Iterate through visibleMapSection to draw tiles
    visibleMapSection.forEach(layer => {
      layer.forEach((tileID, i) => {
        if (tileID > 0) {
          const sx = (tileID - 1) % genus.spritesheetWidth * genus.pixelSize; // finds x-axis px on spritesheet
          const sy = Math.floor((tileID - 1) / genus.spritesheetWidth) * genus.pixelSize; // determines row on spritesheet
          const dx = i % screen.frames.col * genus.pixelSize;
          const dy = Math.floor(i / screen.frames.col) * genus.pixelSize;
          
          // Bucket of uppermost tiles
          if (upperTiles.includes(tileID)) {
            const upper = new Tile({
              source: {
                usx: sx,
                usy: sy
              },
              destination: {
                udx: dx, 
                udy: dy
              }
            });
            upper.tileID = tileID;
            uppermost.push(upper);
          };

          // Check for collision tiles
          if (tileID === 25) { 
            const boundary = new Tile({
              destination: {
                bdx: dx, 
                bdy: dy
              }
            });
            boundaries.push(boundary);
          // } else if (waterTiles.includes(tileID)) {
          //   const water = new Tile({
          //     source: {
          //       wsx: sx,
          //       wsy: sy
          //     },
          //     destination: {
          //       wdx: dx,
          //       wdy: dy
          //     }
          //   });
          //   wateries.push(water);
          } else {
            ctx.drawImage(
              genus,
              sx,
              sy,
              genus.pixelSize,
              genus.pixelSize,
              dx,
              dy,
              genus.pixelSize,
              genus.pixelSize
            );
          };
        };
      });
    });

    // Draw objects that are located on visible screen
    inWorldObjects.forEach(item => {
      if (
        item.destination.dx >= 0 &&
        item.destination.dx < screen.width &&
        item.destination.dy >= 0 &&
        item.destination.dy < screen.height
      ) {
        // item.isVisible = true;
        item.draw(ctx);
      };
    });
    // Draw player after drawing minimap
    player.draw(ctx);

    // Draw uppermost layer
    uppermost.forEach(tile => {
      ctx.drawImage(
        genus,
        tile.source.usx,
        tile.source.usy,
        tile.pixelSize,
        tile.pixelSize,
        tile.destination.udx,
        tile.destination.udy,
        tile.pixelSize,
        tile.pixelSize
      );
    });
  };

  // Handle Water Animation
  // const drawOcean = ({ player }) => {
  //   const rando = Math.floor(Math.random() * 8);
  //   for (let i = 0 ; i < wateries.length ; i++) {
  //     const waterTile = wateries[i];

  //     ctx.drawImage(
  //       genus,
  //       rando * waterTile.pixelSize,
  //       waterTile.source.wsy,
  //       waterTile.pixelSize,
  //       waterTile.pixelSize,
  //       waterTile.destination.wdx,
  //       waterTile.destination.wdy,
  //       waterTile.pixelSize,
  //       waterTile.pixelSize
  //     );
  //   };
  //   player.draw(ctx);
  // };

  // Collision Detection
  const collisionDetect = (newX, newY) => {
    for (let i = 0 ; i < boundaries.length ; i++) {
      const boundary = boundaries[i];

      if (
        newX < boundary.destination.bdx + boundary.pixelSize &&
        newX + player.pixelSize > boundary.destination.bdx &&
        newY < boundary.destination.bdy + boundary.pixelSize &&
        newY + player.pixelSize > boundary.destination.bdy
      ) {
        return true;
      };
    };
  };
  
  // Implement Player Movement | event listeners for player movement and collision
  addEventListener('keydown', (e) => {
    let newX = player.destination.dx + player.offset;
    let newY = player.destination.dy + player.offset;
    let valX = 0;
    let valY = 0;

    if (form.closed && !chatbox && !player.cooldown) {
      switch(e.key) {
        case 'w' :
          player.direction = player.source.upward;
          newY -= player.pixelSize;
          valY--;
          break;
          
        case 's' :
          player.direction = player.source.downward;
          newY += player.pixelSize;
          valY++;
          break;
          
        case 'a' :
          player.direction = player.source.leftward;
          newX -= player.pixelSize;
          valX--;
          break;
          
        case 'd' :
          player.direction = player.source.rightward;
          newX += player.pixelSize;
          valX++;
          break;
          
        default: break;
      };

      if (!collisionDetect(newX, newY)) {
        // update player location in world
        player.data.performance.location.x += valX;
        player.data.performance.location.y += valY;
        // update object's locations in world
        inWorldObjects.forEach(item => {
          item.destination.dx -= valX * item.pixelSize * item.scale;
          item.destination.dy -= valY * item.pixelSize * item.scale;
        });
      };

      player.cooldown = true;
      setTimeout(() => {
        player.cooldown = false;
      }, player.speed);
    };

    // Redraw map and player when player moves
    form.closed && drawGenus({ player });    
  });

  // Handle in-world object behavior
  let inWorldObjects = [];

  const initItem = (item, id, type, source, destination) => {
    const rpgItem = new Item(item, id, source, destination);

    for (const key in resources.itemData) {
      if (key === type) console.log(type)
    }
  };
  
  const item = new Item(
    'sword', 
    inWorldObjects.length + 1 ,
    {
      source: {
        sx: 160,
        sy: 32
      },
      destination: {
        dx: 384,
        dy: 384
      }
    }
  );

  inWorldObjects.push(item);

  // canvas.addEventListener('mousedown', () => {
  //   inWorldObjects.forEach(item => item.handleMouseDown());
  // });

  // canvas.addEventListener('mousemove', () => {
  //   inWorldObjects.forEach(item => item.handleMouseMove());
  // });

  // canvas.addEventListener('mouseup', () => {
  //   inWorldObjects.forEach(item => item.handleMouseUp());
  // });
  
  // const handleCanvasUpdates = () => {

  // }

  // setInterval(() => {
  //   drawOcean({ player });
  // }, 1000);
 
  // Game Loop Function
  // function animate () {
  //   requestAnimationFrame(animate);
  // };
    
  // animate();
});
    
// addEventListener('resize', drawMap);


// water animation
// stairs and holes

// user interface
// inventory functionality
// equipping items
// depot box function
// mailbox function
// trash function
// fishing function
// npcs/interaction/dialogue
// attack functions
// determine skills and lvl algorithms

// ----------------------------

// let lastShimmerInterval = 200;

// const drawOcean = () => {
//   // lastShimmerRender += 1;

//   const randomTile = (min, max) => {
//     const tiles = [0, 32, 64, 96, 128, 160, 192, 224, 256];
//     return tiles[Math.floor((Math.random() * (max - min)) + min)];
//   };
  
//   // if (lastShimmerRender > shimmerInterval) {
//     for (let dy = 0 ; dy < canvas.height ; dy+= 32) {
//       for (let dx = 0 ; dx < canvas.width ; dx+= 32) {
//         resources.mapData.isLoaded && ctx.drawImage(
//           resources.spritesheet,
//           randomTile(0, 5), // source x 0 - 128
//           randomTile(6, 9), // source y 192 - 256
//           resources.frameSize, // source width
//           resources.frameSize, // source height
//           dx, // where to draw
//           dy,
//           resources.frameSize, // draw this size width
//           resources.frameSize // draw this size height
//         );
//       };
//     }
//     // lastShimmerRender = 0;
//   // }
// };