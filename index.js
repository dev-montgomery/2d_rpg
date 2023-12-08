import { resources } from './src/resources.js';
import { Item, Tile, Player } from './src/Classes.js';

window.addEventListener('load', (event) => {

  // Create canvas and context
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = 1024;
  canvas.height = 704;
  
  // Visible map
  const screen = {
    frames: { row: 11, col: 13 },
    width: 832, // 6.5 squares on each side of player
    height: 704 // 5 up and down
  };

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
  window.addEventListener('beforeunload', e => {
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
  let boundaries = [], wateries = [], itemsVisible = [];
  
  // Draw map, takes in player coordinates and JSON data
  const drawGenus = ({ player }, currentMap = resources.mapData.isLoaded && resources.mapData.genus01.layers) => {
    boundaries = [];
    wateries = [];
    itemsVisible = [];

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
        item.draw(ctx);
        itemsVisible.push(item);
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

    // Draw interface
    drawUI();
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

  // Handle in-world object behavior
  let inWorldObjects = [];
  const itemData = document.querySelector('#item-info');

  // Function to Generate Item and Stats
  const initItem = (id, type, name, { source, destination }) => {
    const rpgItem = new Item(id, type, name, { source, destination });
    // all item stats 3 layers deep
    for (const category in resources.itemData) {
      if (category === type) {
        for (const item in resources.itemData[category]) {
          if (item === name) {
            for (const property in resources.itemData[category][item]) {
              rpgItem[property] = resources.itemData[category][item][property];
            };
          };
        };
      };
    };
    // console.log()
    console.log(`${rpgItem.name} created - `, rpgItem);
    inWorldObjects.push(rpgItem);
  };
  setTimeout(() => {
    initItem(
      inWorldObjects.length + 1,
      'mainhand',
      'sword', 
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
    )
  }, 500)

  // Create Side User Interface - Map | Inventory | Attack List
  const ui = new Image();
  ui.src = './backend/assets/interface/inventory_items.png';
  ui.equip = {
    x: 0,
    y: 0,
    width: 192,
    height: 192
  };

  // Map ui

  // Inventory ui
  const drawUI = () => {
    ctx.drawImage(
      ui,
      ui.equip.x,
      ui.equip.y,
      ui.equip.width,
      ui.equip.height,
      screen.width,
      0,
      ui.equip.width,
      ui.equip.height
    ) 
  };
  
  const offsetEquip = 16;
  const equipmentSlots = {
    neck: { x: screen.width + offsetEquip, y: offsetEquip },
    head: { x: screen.width + (offsetEquip * 5), y: offsetEquip },
    back: { x: screen.width + (offsetEquip * 9), y: offsetEquip },
    chest: { x: screen.width + offsetEquip, y: offsetEquip * 5 },
    offhand: { x: screen.width + (offsetEquip * 9), y: offsetEquip * 5 },
    mainhand: { x: screen.width + offsetEquip, y: offsetEquip * 9 },
    legs: { x: screen.width + (offsetEquip * 5), y: offsetEquip * 9 },
    feet: { x: screen.width + (offsetEquip * 9), y: offsetEquip * 9 },
  }
  // List ui

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
 
  // Handle item behavior
  // isMouseOver checks if the mouse is over an item
  const isMouseOver = (mouseX, mouseY, { item }) => {
    return (
      mouseX >= item.destination.dx &&
      mouseX <= item.destination.dx + item.pixelSize * item.scale &&
      mouseY >= item.destination.dy &&
      mouseY <= item.destination.dy + item.pixelSize * item.scale
    );
  };

  // This event listener handles 
  addEventListener('mousedown', (e) => {
    let mouseX = e.clientX - canvas.getBoundingClientRect().left;
    let mouseY = e.clientY - canvas.getBoundingClientRect().top;
  
    itemsVisible.forEach(item => {
      if (isMouseOver(mouseX, mouseY, { item })) {
        item.isDragging = true;
        canvas.style.cursor = 'grabbing';
      };
    });
  });
  
  // Displays Item Stats | Also handles dragging items
  addEventListener('mousemove', (e) => {
    let mouseX = e.clientX - canvas.getBoundingClientRect().left;
    let mouseY = e.clientY - canvas.getBoundingClientRect().top;
  
    itemsVisible.forEach(item => {
      if (isMouseOver(mouseX, mouseY, { item })) {
        if (item.type === 'mainhand' && !item.isDragging) {
          itemData.innerHTML = `
            ${item.name} (${item.type})<br>
            damage: ${item.offense}<br>
            speed: ${item.speed}<br>
            capweight: ${item.capacity}
          `;

          itemData.style.display = 'block';
          itemData.style.border = '1px solid #fff';
          canvas.style.cursor = 'grab';
        };
      } else {
        itemData.style.display = 'none';
        itemData.style.border = 'none';
        canvas.style.cursor = 'pointer';
      };

      if (item.isDragging) {        
        item.destination.dx = e.clientX - canvas.getBoundingClientRect().left - item.pixelSize;
        item.destination.dy = e.clientY - canvas.getBoundingClientRect().top - item.pixelSize;
        
        ctx.clearRect(0, 0, screen.width, screen.height);
        drawGenus({ player });
        item.draw(ctx);
      };
    });
  });
  
  // Handles item behavior when dropped
  addEventListener('mouseup', (e) => {
    itemsVisible.forEach(item => {
      let posX = e.clientX - canvas.getBoundingClientRect().left;
      let posY = e.clientY - canvas.getBoundingClientRect().top;
      item.destination.dx = Math.floor(posX / 64) * 64;
      item.destination.dy = Math.floor(posY / 64) * 64;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGenus({ player });
      item.draw(ctx);
      player.draw(ctx);
      if (item.isDragging) {
        item.isDragging = false;
        canvas.style.cursor = 'pointer';
      };
    });
  });

  
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