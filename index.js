import { resources } from './src/resources.js';
import { Item, Tile, Player } from './src/Classes.js';

window.addEventListener('load', (event) => {

  // Canvas and Screen Sizes
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = 1024;
  canvas.height = 704;
  
  const screen = { frames: { row: 11, col: 13 }, width: 832, height: 704 };

  // Image Resources | Initial Properties
  const bg = new Image();
  bg.src = './backend/assets/east_oasis.png';
  canvas.style.backgroundImage = `url(${bg.src})`;
  canvas.style.backgroundRepeat = 'no-repeat';
  canvas.style.backgroundSize = 'cover';
  document.body.style.backgroundColor = '#336c97';

  const ui = new Image();
  ui.src = './backend/assets/interface/genus-interface-assets.png';
  ui.toggleUIButtons = {
    mapbtn: { sx: 96, sy: 320, dx: screen.width + 16, dy: 208, width: 32, height: 32 },
    inventorybtn: { sx: 128, sy: 320, dx: screen.width + 80, dy: 208, width: 32, height: 32 },
    listbtn: { sx: 160, sy: 320, dx: screen.width + 142, dy: 208, width: 32, height: 32 }
  };

  const mapModal = new Image();
  mapModal.src = './backend/assets/map_data/genus_01.png';

  const genus = new Image();
  genus.src = './backend/assets/map_data/genus-resources-64.png';
  genus.pixelSize = 64;
  genus.spritesheetWidth = 25;
  genus.mapSize = { row: 160, col: 140 };
  genus.onload = () => { genus.loaded = true };

  // Const Variables - Integers | Arrays | Objects | Selectors
  const offsetEquip = 16;
  const upperTiles = [ 576, 577, 578, 579, 601, 602, 603, 604 ];
  const waterTiles = [ 1, 2, 3, 4, 5, 6, 7, 8 ];
  const scrollMapBtns = { 
    inactiveDown : { sx: 0, sy: 320, dx: screen.width + 160, dy: 288, pixelSize: 32 },
    inactiveUp: { sx: 32, sy: 320, dx: screen.width + 160, dy: 256, pixelSize: 32 },
    activeDown: { sx: 0, sy: 352, dx: screen.width + 160, dy: 288, pixelSize: 32 },
    activeUp: { sx: 32, sy: 352, dx: screen.width + 160, dy: 256, pixelSize: 32 }
  };
  const mapContentsGenus = {
    1: { location: { x: 493, y: 588 }, area: "The Genus Temple", description: "An antiquated sanctuary said to have been constructed when gods wandered the Oasis. In service to the old world, warpriest Heremal welcomes new generations of warriors." },
    2: { location: { x: 530, y: 545 }, area: "Willow's Rest", description: "It lacks charm, comfort, and cleanliness. It is not a mystical retreat, nor a grove of tranquility. It is a place where warriors sleep." },
    3: { location: { x: 489, y: 549 }, area: "Spell's Antica", description: "Unleash the power within and embark on a journey where every incantation opens a door of possibility. Your adventure in the arcane begins here." },
    4: { location: { x: 451, y: 534 }, area: "Textiles and Tools", description: "Your clothes and your tools are a reflection of you. Begin your journey with the right weapon, a tunic that covers your nipples, and a fishing pole so you won't go hungry." },
    5: { location: { x: 454, y: 557 }, area: "Genus Harvest", description: "Unique foods offer a unique experience. The right meal can fill you with the warmth of a thousand hearths. The wrong one can send you on a gastronomic adventure." },
    6: { location: { x: 525, y: 420 }, area: "House Militem", description: "Set forth into the world with a foundation of physical prowess as a knight of the East Oasis. A symbol of strength and valor. Their tales are sung by bards. Their deeds, etched into the tapestry of the Oasis." },
    7: { location: { x: 506, y: 444 }, area: "Pillar of The Militem", description: "Etched on a plaque near the base: \"Arm Day, every day.\" - Knight Aalok" },
    8: { location: { x: 456, y: 496 }, area: "House Arcus", description: "The archer of the East Oasis is the harbinger of swift and precise justice. Every arrow, a choice, shaping destiny." },
    9: { location: { x: 476, y: 472 }, area: "Pillar of The Arcus", description: "Etched on a plaque near the base: \"Pew Pew Pew!\" - Guy With Bow" },
    10: { location: { x: 456, y: 420 }, area: "House Maleficus", description: "Those of the East Oasis who embrace the arcane seek the rawest form of power. Many fear it like the storm, but never has an arrow broken a storm. Never has a shield stopped its path." },
    11: { location: { x: 476, y: 444 }, area: "Pillar of The Maleficus", description: "Etched on a plaque near the base: \"Ancient spirits of evil...\" - Mumm-Ra" },
    12: { location: { x: 525, y: 496 }, area: "House Medicus", description: "Discover the power derived from nature as a guardian of its secrets. To be a harbinger of life is to also be an arbiter of death." },
    13: { location: { x: 506, y: 472 }, area: "Pillar of The Medicus", description: "Etched on a plaque near the base: \"We surreptitiously live surrounded by magic... in the petals. the leaves, the roots of Oasis trees. Those who take the time to appreciate it are bound to learn from it.\" - Riker" },
    14: { location: { x: 403, y: 477 }, area: "Swiftpost: Genus", description: "Purchase a letter to send to a friend or a parcel to ship items. The Swiftpost is where you may also purchase labels for your backpacks." },
    15: { location: { x: 395, y: 433 }, area: "Depot: Genus", description: "A place to hang your rope, stash your shovel, deposit your coin, and do business with others; however, buyer beware. Trades are not guaranteed." },
    16: { location: { x: 458, y: 386 }, area: "Feybrew Flasks", description: "A wise man once said, \"buy some flasks.\" These flasks will meet your needs. A quick heal, some desired energy, a cure for what ails you. You'll be hard-pressed to find more suitable potions on Genus." },
    17: { location: { x: 511, y: 380 }, area: "Genus Weaponsmith", description: "If you are finding your adventures across Genus difficult, it may very well be because you are ill equipped. Purchase a finer weapon and mind your skills. Maybe visit the armory." },
    18: { location: { x: 571, y: 395 }, area: "Genus Armory", description: "For a hefty price, you may acquire some of the island's finest armor. For a moderate price you can buy something else." },
    19: { location: { x: 585, y: 435 }, area: "The Ugly Door Tavern", description: "\"Where's this ugly door?\" That's not important. Enter and enjoy a bad selection of liquor. It's the best." },
    20: { location: { x: 575, y: 482 }, area: "Ye Old Curio", description: "Want to see the Troll King's Cudgel? Or a necklace from a dig of an ancient Merk city? What about the horns of a Minos? Ye Old Curio is a store filled with curious items found across Genus." },
    21: { location: { x: 285, y: 462 }, area: "Westbridge", description: "The bridge in the west is currently inaccessible." },
    22: { location: { x: 660, y: 462 }, area: "Eastbridge", description: "The bridge in the east is currently inaccessible." },
    23: { location: { x: 250, y: 80 }, area: "The Poison Fields", description: "Beware the spiders in the poison fields. You may be strong enough to handle the spiders, but their poison often proves deadly. On a separate note, The Poison Fields is the only area the Genus Rose grows." },
    24: { location: { x: 560, y: 270 }, area: "The Fanged Glen", description: "North of town is a spacious area known for its wolf population. Be careful running into packs of wolves. It becomes exponentially difficult to defend against multiple foes." },
    25: { location: { x: 252, y: 360 }, area: "The River Den", description: "Discover the ocean river below, but beware the area's rats and spiders that roam the den." },
    26: { location: { x: 190, y: 210 }, area: "The Grottos", description: "Some dangerous creatures can be found in the light of day. More fearsome creatures lurk in its shadows. There are long told tales of a Troll King somewhere beneathe the islands. Beware in the Grottos." }
  };
  const equip = {
    area: { x: screen.width, y: 0 , size: 192 },
    neck: { slot: null, x: screen.width + offsetEquip, y: offsetEquip },
    head: { slot: null, x: screen.width + (offsetEquip * 5), y: offsetEquip },
    back: { slot: null, x: screen.width + (offsetEquip * 9), y: offsetEquip },
    chest: { slot: null, x: screen.width + offsetEquip, y: offsetEquip * 5 },
    offhand: { slot: null, x: screen.width + (offsetEquip * 9), y: offsetEquip * 5 },
    mainhand: { slot: null, x: screen.width + offsetEquip, y: offsetEquip * 9 },
    legs: { slot: null, x: screen.width + (offsetEquip * 5), y: offsetEquip * 9 },
    feet: { slot: null, x: screen.width + (offsetEquip * 9), y: offsetEquip * 9 },
  };
  const itemData = document.querySelector('#item-info');
  const form = document.querySelector('.form-container');
  const login = document.getElementById('login-form');

  // Let Variables - Strings | Bools | Arrays | Objects
  let currentInterface = 'inventorybtn';
  let activeButtonFlag = false;
  let chatbox = false;
  let boundaries = [], wateries = [];
  let inWorldObjects = [];
  let equipped = [];
  let inventory = [];
  let originalItemPosition = {};

  // Init Player
  const player = new Player({
    source: { downward: { sx: 0, sy: 0 }, upward: { sx: 0, sy: 64 }, rightward: { sx: 64, sy: 0 }, leftward: { sx: 64, sy: 64 } },
    destination: { dx: screen.width * 0.5 - 48, dy: screen.height * 0.5 - 48 }
  });

  // Append Stats
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
  
  // First render of game happens here after player data loads
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
      document.querySelector('.game-container').style.boxShadow = '0 0 10px black';
      genus.loaded && drawGenus({ player });
      drawInterface();
    }, 500);
  };

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

  // Draw Functions
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
              source: { usx: sx, usy: sy },
              destination: { udx: dx, udy: dy }
            });
            upper.tileID = tileID;
            uppermost.push(upper);
          };

          // Check for water tiles
          if (waterTiles.includes(tileID)) {
            const water = new Tile({
              source: {
                wsx: sx,
                wsy: sy
              },
              destination: {
                wdx: dx,
                wdy: dy
              },
              pixelSize: 64
            });
            wateries.push(water);
          };

          // Check for collision tiles
          if (tileID === 25) { 
            const boundary = new Tile({
              destination: { bdx: dx, bdy: dy }
            });
            boundaries.push(boundary);
          } else {
            ctx.drawImage( genus, sx, sy, genus.pixelSize, genus.pixelSize, dx, dy, genus.pixelSize, genus.pixelSize );
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
      };
    });

    // Draw player after drawing minimap and items
    player.draw(ctx);
    
    // Draw uppermost layer after map | player | items
    uppermost.forEach(tile => {
      ctx.drawImage( genus, tile.source.usx, tile.source.usy, tile.pixelSize, tile.pixelSize, tile.destination.udx, tile.destination.udy, tile.pixelSize, tile.pixelSize );
    });
  };

  const drawInterfaceToggle = (selected = 'inventorybtn') => {
    let active;
    switch(selected) {
      case 'mapbtn':
        active = ui.toggleUIButtons.mapbtn;
        break;
      case 'inventorybtn':
        active = ui.toggleUIButtons.inventorybtn;
        break;
      case 'listbtn':
        active = ui.toggleUIButtons.listbtn;
        break;
      default: 
        break;
    };
    
    // draw toggle background
    ctx.drawImage( ui, 0, 192, 192, 64, screen.width, 192, 192, 64 );

    // draw selected
    ctx.drawImage( ui, 128, 256, 34, 34, active.dx - 1, active.dy - 1, 34, 34 );

    // draw buttons
    for (const btn in ui.toggleUIButtons) {
      ctx.drawImage( ui, ui.toggleUIButtons[btn].sx, ui.toggleUIButtons[btn].sy, ui.toggleUIButtons[btn].width, ui.toggleUIButtons[btn].height, ui.toggleUIButtons[btn].dx, ui.toggleUIButtons[btn].dy, ui.toggleUIButtons[btn].width, ui.toggleUIButtons[btn].height );
    };
  };
  
  const drawMapContentSection = () => {
    ctx.clearRect(screen.width, 0, 192, 192);
    ctx.clearRect(screen.width, 256, 192, 448);
    ctx.drawImage( mapModal, 0, 0, 1200, 1300, 128, 20, screen.width - 230, screen.height - 40 );
    ctx.font = '1.5rem Arial';
    ctx.fillText('Genus Island', screen.width + 20, 50);
    ctx.font = '1rem Arial';
    ctx.fillText('Town and Outskirts', screen.width + 20, 80);
    if (!activeButtonFlag) {
      ctx.drawImage( ui, scrollMapBtns.activeUp.sx, scrollMapBtns.activeUp.sy, scrollMapBtns.activeUp.pixelSize, scrollMapBtns.activeUp.pixelSize, scrollMapBtns.activeUp.dx, scrollMapBtns.activeUp.dy, scrollMapBtns.activeUp.pixelSize, scrollMapBtns.activeUp.pixelSize );
      ctx.drawImage( ui, scrollMapBtns.inactiveDown.sx, scrollMapBtns.inactiveDown.sy, scrollMapBtns.inactiveDown.pixelSize, scrollMapBtns.inactiveDown.pixelSize, scrollMapBtns.inactiveDown.dx, scrollMapBtns.inactiveDown.dy, scrollMapBtns.inactiveDown.pixelSize, scrollMapBtns.inactiveDown.pixelSize );
      let keyCount = 0;
      
      ctx.font = '0.8rem Arial';
      ctx.fillText("Genus Island Contents", screen.width + 15, 286);

      for (const key in mapContentsGenus) {
        if (mapContentsGenus[key].cx) {
          delete mapContentsGenus[key].cx;
          delete mapContentsGenus[key].cy;
        };

        if (mapContentsGenus.hasOwnProperty(key)) {
          const mapX = screen.width + 25, mapY = 310 + (20 * keyCount);
          ctx.fillText( mapContentsGenus[key].area, mapX, mapY );
          
          mapContentsGenus[key].cx = mapX;
          mapContentsGenus[key].cy = mapY - 12;
          mapContentsGenus[key].width = 130;
          mapContentsGenus[key].height = 20;
        };

        keyCount++;

        if(keyCount === 20) break;
      }; 
    } else if (activeButtonFlag) {
      ctx.drawImage( ui, scrollMapBtns.inactiveUp.sx, scrollMapBtns.inactiveUp.sy, scrollMapBtns.inactiveUp.pixelSize, scrollMapBtns.inactiveUp.pixelSize, scrollMapBtns.inactiveUp.dx, scrollMapBtns.inactiveUp.dy, scrollMapBtns.inactiveUp.pixelSize, scrollMapBtns.inactiveUp.pixelSize );
      ctx.drawImage( ui, scrollMapBtns.activeDown.sx, scrollMapBtns.activeDown.sy, scrollMapBtns.activeDown.pixelSize, scrollMapBtns.activeDown.pixelSize, scrollMapBtns.activeDown.dx, scrollMapBtns.activeDown.dy, scrollMapBtns.activeDown.pixelSize, scrollMapBtns.activeDown.pixelSize );
      let keyCount = 0, yAxis = 0;

      ctx.font = '0.8rem Arial';
      ctx.fillText("Genus Island Contents", screen.width + 15, 286);

      for (const key in mapContentsGenus) {
        if (mapContentsGenus[key].cx) {
          delete mapContentsGenus[key].cx;
          delete mapContentsGenus[key].cy;
        };

        if (mapContentsGenus.hasOwnProperty(key)) {
          keyCount++;
        };

        if (keyCount > 20) {
          const mapX = screen.width + 25, mapY = 310 + (20 * yAxis);
          ctx.fillText( mapContentsGenus[key].area, mapX, mapY );

          mapContentsGenus[key].cx = mapX;
          mapContentsGenus[key].cy = mapY - 12;
          mapContentsGenus[key].width = 130;
          mapContentsGenus[key].height = 20;
          yAxis++;
        };

        if (keyCount >= 26) break;
      };
    };
  };

  const drawEquip = () => {
    ctx.clearRect(screen.width, 0, 192, 192);
    ctx.drawImage( ui, 0, 0, 192, 192, screen.width, 0, 192, 192 );
    equipped.forEach(item => item.draw(ctx));
  };

  const drawInventory = (backpack = 'backpack', container = null) => {
    ctx.clearRect(screen.width, 256, 192, 448);
    ctx.fillStyle = '#fff';
    ctx.fillRect(screen.width, 256, 192, 448)
    
    if (backpack) {
      switch (backpack) {
        case 'backpack':
          for (let row = 0 ; row < 5 ; row ++) {
            for (let slot = 0 ; slot < 6 ; slot++) {
              ctx.drawImage(
                ui,
                64,
                288,
                32,
                32,
                screen.width + (slot * 32),
                256 + (row * 32),
                32,
                32
              );
            };
          };
          break;
        case 'labledbackpack':

          break;
        case 'enchantedbackpack':

          break;
        case 'labeledenchantedbackpack':

          break;
        default:
          break;
      }
    }
  };

  const drawInterface = (input = 'inventorybtn') => {
    ctx.clearRect( screen.width, 0, 192, 704 );
    drawGenus({ player });
    switch(input) {
      case 'mapbtn':
        // mapbtn functions
        drawInterfaceToggle(input);
        drawMapContentSection();
        break;
      case 'inventorybtn':
        drawEquip();
        drawInterfaceToggle(input);
        drawInventory();
      break;
      case 'listbtn':
        // list functions
        drawInterfaceToggle(input);
        break;
      default: break;
    };
  };

  // Utility Functions
  const initItem = (id, type, name, { source, destination }) => {
    const rpgItem = new Item(id, type, name, { source, destination });
    
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
    console.log(`${rpgItem.name} created - `, rpgItem);
    inWorldObjects.push(rpgItem);
  };

  const isInPlayerRange = (objX, objY) => {
    return (
      objX >= screen.width / 2 - 96 &&
      objX < screen.width / 2 + 96 &&
      objY >= screen.height / 2 - 96 &&
      objY < screen.height / 2 + 96
    );
  };
  
  const isMouseOverItem = (mouseX, mouseY, item) => {
    return (
      mouseX >= item.destination.dx &&
      mouseX <= item.destination.dx + item.pixelSize * item.scale &&
      mouseY >= item.destination.dy &&
      mouseY <= item.destination.dy + item.pixelSize * item.scale
    );
  };

  const findItemUnderMouse = (mouseX, mouseY, array) => {
    canvas.style.cursor = 'grab';
    for (let i = array.length - 1 ; i >= 0 ; i--) {
      const currentItem = array[i];
      if (isMouseOverItem(mouseX, mouseY, currentItem)) {
        return currentItem;
      };
    };
    return null;
  };

  const isMouseOverMapScrollButton = (mouseX, mouseY, btn) => {
    return (
      mouseX >= btn.dx &&
      mouseX <= btn.dx + btn.pixelSize &&
      mouseY >= btn.dy &&
      mouseY <= btn.dy + btn.pixelSize
    );
  };

  const isMouseOverContent = (mouseX, mouseY, content) => {
    return (
      mouseX >= content.cx &&
      mouseX <= content.cx + content.width &&
      mouseY >= content.cy &&
      mouseY <= content.cy + content.height
    );
  };

  const findContentUnderMouse = (mouseX, mouseY) => {
    for (let content in mapContentsGenus) {
      const currentContent = mapContentsGenus[content];
      if (isMouseOverContent(mouseX, mouseY, currentContent)) {
        return currentContent;
      };
    };
    return null;
  };

  const fillLinesOfText = (name, text, width) => {
    let line = '', lines = [], array = text.split(' ');
    
    for (let i = 0 ; i < array.length ; i++) {
      if (line === '') {
        line += array[i];
      } else if (line.length + 1 + array[i].length <= width) {
        line += ' ' + array[i];
      } else {
        lines.push(line);
        line = '';
        i--;
      };
    };
    
    if (line.length > 0) lines.push(line);
    
    ctx.clearRect(screen.width, 0, 192, 192);

    for (let i = 16, index = 0 ; i < 176 ; i+= 16, index++) {
      if (lines[index]) {
        ctx.font = '0.8rem Arial';
        ctx.fillText(name, screen.width + 15, 25);
        ctx.fillText(lines[index], screen.width + 15, 30 + i);
      };
    };
  };

  const checkToggle = (mouseX, mouseY) => {
    if (
      mouseX >= ui.toggleUIButtons.mapbtn.dx &&
      mouseX <= ui.toggleUIButtons.mapbtn.dx + ui.toggleUIButtons.mapbtn.width &&
      mouseY >= ui.toggleUIButtons.mapbtn.dy &&
      mouseY <= ui.toggleUIButtons.mapbtn.dy + ui.toggleUIButtons.mapbtn.height
    ) {
      return 'mapbtn';
    };

    if (
      mouseX >= ui.toggleUIButtons.inventorybtn.dx &&
      mouseX <= ui.toggleUIButtons.inventorybtn.dx + ui.toggleUIButtons.inventorybtn.width &&
      mouseY >= ui.toggleUIButtons.inventorybtn.dy &&
      mouseY <= ui.toggleUIButtons.inventorybtn.dy + ui.toggleUIButtons.inventorybtn.height
    ) {
      return 'inventorybtn';
    };

    if (
      mouseX >= ui.toggleUIButtons.listbtn.dx &&
      mouseX <= ui.toggleUIButtons.listbtn.dx + ui.toggleUIButtons.listbtn.width &&
      mouseY >= ui.toggleUIButtons.listbtn.dy &&
      mouseY <= ui.toggleUIButtons.listbtn.dy + ui.toggleUIButtons.listbtn.height
    ) {
      return 'listbtn';
    };
  };

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
    return false;
  };

  const waterDetect = (newX, newY) => {
    for (let i = 0 ; i < wateries.length ; i++) {
      const water = wateries[i];

      if (
        newX < water.destination.wdx + water.pixelSize &&
        newX + player.pixelSize > water.destination.wdx &&
        newY < water.destination.wdy + water.pixelSize &&
        newY + player.pixelSize > water.destination.wdy
      ) {
        return true;
      };
    };
    return false;
  };

  const isInEquipArea = (item) => {
    return (
      item.destination.dx < screen.width + 192 &&
      item.destination.dx + item.pixelSize > screen.width &&
      item.destination.dy < 192 &&
      item.destination.dy + item.pixelSize > 0
    );
  };

  const handleEquipping = (item) => {
    if (isInEquipArea(item)) {
      switch(item.type) {
        case 'neck':
          if (equip.neck.slot) {
            
          }
          break;
        case 'head':
          if (equip.head.slot) {
            
          }
          break;
        case 'back':
          if (equip.back.slot) {
            
          }
          break;
        case 'chest':
          if (equip.chest.slot) {
            
          }
          break;
        case 'offhand':
          if (equip.offhand.slot) {
            
          }
          break;
        case 'mainhand':
          if (equip.mainhand.slot) {
            const prev = equip.mainhand.slot;
            if (prev.id !== item.id) {
              equip.mainhand.slot = null;
              prev.destination.dx = player.destination.dx + 16;
              prev.destination.dy = player.destination.dy + 16;
              prev.scale = 1;
              inWorldObjects.push(prev);
              equipped.splice(equipped.indexOf(prev), 1);
            };
          };

          if (equip.mainhand.slot === null) {
            equip.mainhand.slot = item;
            item.destination.dx = equip.mainhand.x;
            item.destination.dy = equip.mainhand.y;
            item.scale = 0.5;
            equipped.push(item);
            inWorldObjects.splice(inWorldObjects.indexOf(item), 1);
          };

          drawGenus({ player });
          drawEquip();  
          break;
        case 'legs':
          if (equip.legs.slot) {
            
          }
          break;
        case 'feet':
          if (equip.feet.slot) {
            
          }
          break;
        default: break;
      };
    };
  };

  const resetEquipSlot = (item) => {
    switch(item.type) {
      case 'neck':
        equip.neck.slot = null;
        break;
      case 'head':
        equip.head.slot = null;
        break;
      case 'back':
        equip.back.slot = null;
        break;
      case 'chest':
        equip.chest.slot = null;
        break;
      case 'offhand':
        equip.offhand.slot = null;
        break;
      case 'mainhand':
        equip.mainhand.slot = null;  
        break;
      case 'legs':
        equip.legs.slot = null;
        break;
      case 'feet':
        equip.feet.slot = null;
        break;
      default: break;
    };
  };

  const isInInventoryArea = (item) => {
    return (
      item.destination.dx < screen.width + 192 &&
      item.destination.dx + item.pixelSize > screen.width &&
      item.destination.dy < screen.height &&
      item.destination.dy + item.pixelSize > 256
    );
  };
  
  // Event Listeners
  addEventListener('mousedown', (e) => {
    const mouseX = e.clientX - canvas.getBoundingClientRect().left;
    const mouseY = e.clientY - canvas.getBoundingClientRect().top;
    const selectedItem = findItemUnderMouse(mouseX, mouseY, inWorldObjects);
    const equippedItem = findItemUnderMouse(mouseX, mouseY, equipped);
    
    if (currentInterface === 'inventorybtn' && equippedItem) {
      equippedItem.isDragging = true;
      canvas.style.cursor = 'grabbing';
      originalItemPosition = {
        x: equippedItem.destination.dx,
        y: equippedItem.destination.dy
      }; 
    };

    if (selectedItem && isInPlayerRange(selectedItem.destination.dx, selectedItem.destination.dy)) {
      selectedItem.isDragging = true;
      canvas.style.cursor = 'grabbing';
      originalItemPosition = {
        x: selectedItem.destination.dx,
        y: selectedItem.destination.dy
      };
    };

    if (checkToggle(mouseX, mouseY)) {
      currentInterface = checkToggle(mouseX, mouseY);
      drawInterface(checkToggle(mouseX, mouseY));
    };

    for (let btn in scrollMapBtns) {
      if (isMouseOverMapScrollButton(mouseX, mouseY, scrollMapBtns[btn])) {
        if (btn == 'activeDown') {
          activeButtonFlag = true;
          ctx.clearRect(screen.width, 256, 192, 448);
          drawMapContentSection();
        } else {
          activeButtonFlag = false;
          ctx.clearRect(screen.width, 256, 192, 448);
          drawMapContentSection();
        };
      };
    };  
  });
  
  addEventListener('mousemove', (e) => {
    const mouseX = e.clientX - canvas.getBoundingClientRect().left;
    const mouseY = e.clientY - canvas.getBoundingClientRect().top;
    const selectedItem = findItemUnderMouse(mouseX, mouseY, inWorldObjects);

    if (selectedItem && !selectedItem.isDragging) {
      switch(selectedItem.type) {
        case 'container':
          itemData.innerHTML = `
            ${selectedItem.name}<br>
            contains: ${selectedItem.slots} items<br>
            capweight: ${selectedItem.capacity}
          `;
          break;
        case 'necklace':
          itemData.innerHTML = `
            ${selectedItem.name}<br>
            offense skill: ${selectedItem.offense}<br>
            defense skill: ${selectedItem.defense}<br>
          `;
          break;
        case 'helmet':
          itemData.innerHTML = `
            ${selectedItem.name}<br>
            defense: ${selectedItem.defense}<br>
            capweight: ${selectedItem.capacity}
          `;
          break;
        case 'chest':
          itemData.innerHTML = `
            ${selectedItem.name}<br>
            defense: ${selectedItem.defense}<br>
            capweight: ${selectedItem.capacity}
          `;
          break;
        case 'legs':
          itemData.innerHTML = `
            ${selectedItem.name}<br>
            defense: ${selectedItem.defense}<br>
            capweight: ${selectedItem.capacity}
          `;
          break;
        case 'feet':
          itemData.innerHTML = `
            ${selectedItem.name}<br>
            defense: ${selectedItem.defense}<br>
            speed: ${selectedItem.speed}<br>
            capweight: ${selectedItem.capacity}
          `;
          break;
        case 'mainhand':
          itemData.innerHTML = `
            ${selectedItem.name}<br>
            damage: ${selectedItem.offense}<br>
            speed: ${selectedItem.speed}<br>
            capweight: ${selectedItem.capacity}
          `;
          break;
        case 'offhand':
          itemData.innerHTML = `
            ${selectedItem.name}<br>
            defense: ${selectedItem.defense}<br>
            capweight: ${selectedItem.capacity}
          `;
          break;
        case 'tool':
          itemData.innerHTML = `
            ${selectedItem.name}<br>
            capweight: ${selectedItem.capacity}
          `;
          break;
        case 'currency':
          itemData.innerHTML = `
            ${selectedItem.name}<br>
            amount: ${selectedItem.amount}<br>
            capweight: ${selectedItem.capacity}
          `;
          break;
        case 'consumable':
          itemData.innerHTML = `
            ${selectedItem.name}<br>
            purpose: ${selectedItem.purpose}<br>
            capweight: ${selectedItem.capacity}
          `;
          break;
        case 'rubbish':
          itemData.innerHTML = `
            ${selectedItem.name}<br>
            capweight: ${selectedItem.capacity}
          `;
          break;
        case 'decor':
          itemData.innerHTML = `
            ${selectedItem.name}<br>
            capweight: ${selectedItem.capacity}
          `;
          break;
        case 'literature':
          itemData.innerHTML = `
            ${selectedItem.name}<br>
            capweight: ${selectedItem.capacity}
          `;
          break;
        default: break;
      };

      itemData.style.display = 'block';
      itemData.style.border = '1px solid #fff';
      canvas.style.cursor = 'grab';
    } else {
      itemData.style.display = 'none';
      itemData.style.border = 'none';
      canvas.style.cursor = 'pointer';
    };

    if (selectedItem && selectedItem.isDragging) {
      inWorldObjects.splice(inWorldObjects.indexOf(selectedItem), 1);
      inWorldObjects.push(selectedItem);      
    };

    if (currentInterface === 'mapbtn') {
      const content = findContentUnderMouse(mouseX, mouseY);
      
      if (content) {
        ctx.clearRect(150, 20, screen.width - 300, screen.height - 40);  
        fillLinesOfText(content.area, content.description, 26);
        ctx.drawImage(mapModal, 0, 0, 1200, 1300, 128, 20, screen.width - 230, screen.height - 40);
        ctx.drawImage(ui, 96, 288, 32, 32, content.location.x, content.location.y, 32, 32)
      };
    };
  });
  
  addEventListener('mouseup', (e) => {
    inWorldObjects.forEach(item => {
      if (item.isDragging && isInPlayerRange(item.destination.dx, item.destination.dy)) {
        let posX = e.clientX - canvas.getBoundingClientRect().left;
        let posY = e.clientY - canvas.getBoundingClientRect().top;
        item.destination.dx = Math.floor(posX / 64) * 64;
        item.destination.dy = Math.floor(posY / 64) * 64;
        
        if (waterDetect(item.destination.dx, item.destination.dy)) {
          inWorldObjects.splice(inWorldObjects.indexOf(item), 1);
        } else if (
          collisionDetect(item.destination.dx, item.destination.dy)) {
          item.destination.dx = originalItemPosition.x;
          item.destination.dy = originalItemPosition.y;
        };

        item.isDragging = false;
        if (currentInterface === 'inventorybtn') handleEquipping(item);
        drawGenus({ player });
      };
    });

    if (currentInterface === 'inventorybtn') {
      equipped.forEach(item => {
        if (item.isDragging) {
          let posX = e.clientX - canvas.getBoundingClientRect().left;
          let posY = e.clientY - canvas.getBoundingClientRect().top;
          item.destination.dx = Math.floor(posX / 64) * 64;
          item.destination.dy = Math.floor(posY / 64) * 64;

          if (waterDetect(item.destination.dx, item.destination.dy)) {
            resetEquipSlot(item);
            equipped.splice(equipped.indexOf(item), 1);
            drawEquip();
          } else if (collisionDetect(item.destination.dx, item.destination.dy)) {
            item.destination.dx = originalItemPosition.x;
            item.destination.dy = originalItemPosition.y;
            item.isDragging = false;
          } else if (
            item.destination.dx + item.pixelSize < screen.width &&
            item.destination.dx > 0 &&
            item.destination.dy + item.pixelSize < screen.height &&
            item.destination.dy > 0 &&
            collisionDetect(item.destination.dx, item.destination.dy) === false
          ) {
            item.scale = 1;
            item.isDragging = false;
            inWorldObjects.push(item);
            resetEquipSlot(item);
            equipped.splice(equipped.indexOf(item), 1);
            drawGenus({ player });
            drawEquip();
          };
        };
      });
    };
  });

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

  login.addEventListener('submit', initPlayerData);

  window.addEventListener('beforeunload', e => {
    e.preventDefault();
    resources.playerData.isLoaded = false;
    updatePlayerData(); 
  });

  // Create Items
  setTimeout(() => {
    // item 1
    initItem(
      inWorldObjects.length + 1,
      'mainhand',
      'tigerclaws', 
      {
        source: {sx: 256, sy: 64 }, 
        destination: { dx: 384, dy: 384 }
      }  
    );
    // item 2
    initItem(
      inWorldObjects.length + 1,
      'mainhand',
      'broadaxe', 
      {
        source: { sx: 448, sy: 64 },
        destination: { dx: 324, dy: 384 }
      }  
    );
    // item 3
    initItem(
      inWorldObjects.length + 1,
      'tool',
      'fishingpole', 
      { 
        source: { sx: 256, sy: 128 },
        destination: { dx: 448, dy: 384 } 
      }
    );
  }, 500);
});