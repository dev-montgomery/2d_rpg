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
  ui.size = 32;
  ui.buttons = {
    menu: {
      mapbtn: { sx: 96, sy: 320, dx: screen.width + 16, dy: 208, size: 32 },
      inventorybtn: { sx: 128, sy: 320, dx: screen.width + 80, dy: 208, size: 32 },
      listbtn: { sx: 160, sy: 320, dx: screen.width + 142, dy: 208, size: 32 },
    },
    stances: {
      attackInactive: { sx: 96, sy: 352, dx: screen.width, dy: 640, size: 32, scale: 2 },
      attackActive: { sx: 96, sy: 384, dx: screen.width, dy: 640, size: 32, scale: 2 },
      defendInactive: { sx: 128, sy: 352, dx: screen.width + 64, dy: 640, size: 32, scale: 2 },
      defendActive: { sx: 128, sy: 384, dx: screen.width + 64, dy: 640, size: 32, scale: 2 },
      passiveInactive: { sx: 160, sy: 352, dx: screen.width + 128, dy: 640, size: 32, scale: 2 },
      passiveActive: { sx: 160, sy: 384, dx: screen.width + 128, dy: 640, size: 32, scale: 2 },
    },
    mapSectionScroll: {
      inactiveDown : { sx: 0, sy: 320, dx: screen.width + 160, dy: 288, size: 32 },
      inactiveUp: { sx: 32, sy: 320, dx: screen.width + 160, dy: 256, size: 32 },
      activeDown: { sx: 0, sy: 352, dx: screen.width + 160, dy: 288, size: 32 },
      activeUp: { sx: 32, sy: 352, dx: screen.width + 160, dy: 256, size: 32 }
    }
  };
  ui.containers = {
    backpack: { x: 0, y: 32 * 8, size: 32 },
    labeledbackpack: { x: 0, y: 32 * 9, size: 32 },
    enchantedbackpack: { x: 32, y: 32 * 8, size: 32 },
    labeledenchantedbackpack: { x: 32, y: 32 * 9, size: 32 },
    depot: { x: 64, y: 32 * 8, size: 32 },
  };

  const mapModal = new Image();
  mapModal.src = './backend/assets/map_data/genus_01.png';

  const genus = new Image();
  genus.src = './backend/assets/map_data/genus-resources-64.png';
  genus.size = 64;
  genus.spritesheetWidth = 25;
  genus.mapSize = { row: 160, col: 140 };
  genus.onload = () => { genus.loaded = true };

  // Const Variables - Integers | Arrays | Objects | Selectors
  const offsetEquip = 16;
  const upperTiles = [ 576, 577, 578, 579, 601, 602, 603, 604 ];
  const waterTiles = [ 1, 2, 3, 4, 5, 6, 7, 8 ];
  const mapContentsGenus = {
    1: { mapx: 493, mapy: 588, area: "The Genus Temple", description: "An antiquated sanctuary said to have been constructed when the gods wandered the Oasis. In service to the old world, warpriest Heremal welcomes new generations of warriors." },
    2: { mapx: 530, mapy: 545, area: "Willow's Rest", description: "It lacks charm, comfort, and cleanliness... but it does have beds." },
    3: { mapx: 489, mapy: 549, area: "Spell's Antica", description: "Unleash the power within and embark on a journey where every incantation opens a door of possibility. Your adventure in the arcane begins here." },
    4: { mapx: 451, mapy: 534, area: "Textiles and Tools", description: "Your clothes and your tools are a reflection of you. Begin your journey with the right weapon, some attire, and a fishing pole so you won't go hungry." },
    5: { mapx: 454, mapy: 557, area: "Genus Harvest", description: "Unique foods offer a unique experience. The right meal can fill you with the warmth of a thousand hearths. The wrong one can send you on a gastronomic adventure." },
    6: { mapx: 525, mapy: 420, area: "House Militem", description: "Set forth into the world with a foundation of physical prowess as a knight of the East Oasis. A symbol of strength and valor. Their tales are sung by bards. Their deeds, etched into the tapestry of the Oasis." },
    7: { mapx: 506, mapy: 444, area: "Pillar of The Militem", description: "Etched on a plaque near the base: \"Arm Day, every day.\" - Knight Aalok" },
    8: { mapx: 456, mapy: 496, area: "House Arcus", description: "The archer of the East Oasis is the harbinger of swift and precise justice. A symbol of courage and independence. Every arrow, shaping the outcome on the battlefield." },
    9: { mapx: 476, mapy: 472, area: "Pillar of The Arcus", description: "Etched on a plaque near the base: \"Pew Pew Pew!\" - Guy With Bow" },
    10: { mapx: 456, mapy: 420, area: "House Maleficus", description: "Those of the East Oasis who embrace the arcane seek the rawest form of power. Many fear it like the storm, but never has an arrow broken a storm. Never has a shield stopped its path." },
    11: { mapx: 476, mapy: 444, area: "Pillar of The Maleficus", description: "Etched on a plaque near the base: \"Ancient spirits of evil...\" - Mumm-Ra" },
    12: { mapx: 525, mapy: 496, area: "House Medicus", description: "Discover the power derived from nature as a guardian of its secrets. To be a harbinger of life is to also be an arbiter of death." },
    13: { mapx: 506, mapy: 472, area: "Pillar of The Medicus", description: "Etched on a plaque near the base: \"We surreptitiously live surrounded by magic... in the petals. the leaves, the roots of Oasis trees. Those who take the time to appreciate it are bound to learn from it.\" - Riker" },
    14: { mapx: 403, mapy: 477, area: "Swiftpost: Genus", description: "Purchase a letter to send to a friend or a parcel to ship items. The Swiftpost is where you may also purchase labels for your backpacks." },
    15: { mapx: 395, mapy: 433, area: "Depot: Genus", description: "A place to hang your rope, stash your shovel, deposit your coin, and do business with others; however, buyer beware. Trades are not guaranteed." },
    16: { mapx: 458, mapy: 386, area: "Feybrew Flasks", description: "A wise man once said, \"buy some flasks.\" These flasks will meet your needs. A quick heal, some desired energy, a cure for what ails you. You'll be hard-pressed to find more suitable potions on Genus." },
    17: { mapx: 511, mapy: 380, area: "Genus Weaponsmith", description: "If you are finding your adventures across Genus difficult, it may very well be because you are ill equipped. Purchase a finer weapon and mind your skills. Maybe visit the armory." },
    18: { mapx: 571, mapy: 395, area: "Genus Armory", description: "For a hefty price, you may acquire some of the island's finest armor. For a moderate price you can buy something else." },
    19: { mapx: 585, mapy: 435, area: "The Ugly Door Tavern", description: "\"Where's this ugly door?\" That's not important. Enter and enjoy a bad selection of liquor. It's the best." },
    20: { mapx: 575, mapy: 482, area: "Ye Old Curio", description: "Want to see the Troll King's Cudgel? Or a necklace from a dig of an ancient Merk city? What about the horns of a Minos? Ye Old Curio is a store filled with curious items found across Genus." },
    21: { mapx: 285, mapy: 462, area: "Westbridge", description: "The bridge in the west is currently inaccessible." },
    22: { mapx: 660, mapy: 462, area: "Eastbridge", description: "The bridge in the east is currently inaccessible." },
    23: { mapx: 250, mapy: 80, area: "The Poison Fields", description: "Beware the spiders in the poison fields. You may be strong enough to handle the spiders, but their poison often proves deadly. On a separate note, the Poison Fields is the only area where the Genus Rose grows." },
    24: { mapx: 560, mapy: 270, area: "The Fanged Glen", description: "North of town is a spacious area known for its wolf population. Be careful running into packs of wolves. It becomes exponentially difficult to defend against multiple foes." },
    25: { mapx: 252, mapy: 360, area: "The River Den", description: "Discover the ocean river below, but beware the area's rats and spiders that roam the den." },
    26: { mapx: 190, mapy: 210, area: "The Grottos", description: "Some dangerous creatures can be found in the light of day. More fearsome creatures lurk in its shadows. There are long told tales of a Troll King somewhere beneathe the islands. Beware in the Grottos." } 
  };
  const equipmentSlotLocations = {
    neck: { x: screen.width + offsetEquip, y: offsetEquip },
    head: { x: screen.width + (offsetEquip * 5), y: offsetEquip },
    back: { x: screen.width + (offsetEquip * 9), y: offsetEquip },
    chest: { x: screen.width + offsetEquip, y: offsetEquip * 5 },
    offhand: { x: screen.width + (offsetEquip * 9), y: offsetEquip * 5 },
    mainhand: { x: screen.width + offsetEquip, y: offsetEquip * 9 },
    legs: { x: screen.width + (offsetEquip * 5), y: offsetEquip * 9 },
    feet: { x: screen.width + (offsetEquip * 9), y: offsetEquip * 9 },
  };
  const inventoryContainerSizes = {
    location: { x: screen.width, y: 256 },
    inventorySection: { x: screen.width, y: 256 }, 
    containerSection: { x: screen.width, y: 416 },
    open: { backpack: false, container: false }
  };
  const itemData = document.querySelector('#item-info');
  const form = document.querySelector('.form-container');
  const login = document.getElementById('login-form');

  // Let Variables - Strings | Bools | Arrays | Objects
  let currentMenu = 'inventorybtn';
  let inventoryScroll = false;
  let mapContentButton = false;
  let chatbox = false;
  let boundaries = [], wateries = [];
  let items = [];
  let equipped = [];
  let inventory = [];
  let originalItemPosition = {};

  // Init Player
  const player = new Player({
    source: { downward: { sx: 0, sy: 0 }, upward: { sx: 0, sy: 64 }, rightward: { sx: 64, sy: 0 }, leftward: { sx: 64, sy: 64 } },
    destination: { dx: screen.width * 0.5 - 48, dy: screen.height * 0.5 - 48 }
  });

  // Append Stats
  const appendPlayerData = ({ player }) => {
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

    const equipment = player.data.performance.equipped;
    for (const piece in equipment) {
      if (equipment[piece] !== 'empty') {
        const item = equipment[piece];
        initItem(item.id, item.type, item.name, item.sx, item.sy, item.dx, item.dy, item.scale);
      };
    };
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
      canvas.style.background = '#464646';
      document.querySelector('.player-stats').style.display = 'flex';
      document.querySelector('.game-container').style.boxShadow = '0 0 10px black';
      genus.loaded && drawGenus({ player });
      appendPlayerData({ player });
      drawRightSideUI();
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

  // ---------------------------------------------------------------------
  // Handle Map Creation | Collision Tiles | Water Tiles | Uppermost Tiles
  const drawGenus = ({ player }, currentMap = resources.mapData.isLoaded && resources.mapData.genus01.layers) => {
    const visibleMapSection = [], uppermost = [];
    boundaries = [];
    wateries = [];

    const startingTile = { 
      x: player.data.performance.location.x - Math.floor(screen.frames.col/2), // 6.5 left
      y: player.data.performance.location.y - Math.floor(screen.frames.row/2) // 5.5 up
    }; // Use location of player to identify upper left corner to begin drawing. 13 x 11 tiles.

    currentMap.forEach(layer => {
      startingTile.num = genus.mapSize.col * (startingTile.y - 1) + startingTile.x;
      let tiles = []; 
      for (let i = 0 ; i < screen.frames.row ; i++) {
        tiles.push(...layer.data.slice(startingTile.num, startingTile.num + screen.frames.col));
        startingTile.num += genus.mapSize.col;
      };
      visibleMapSection.push(tiles);
    }); // Create visibleMapSection of player location

    visibleMapSection.forEach(layer => {
      layer.forEach((tileID, i) => {
        if (tileID > 0) {
          const sx = (tileID - 1) % genus.spritesheetWidth * genus.size; // finds x-axis px on spritesheet
          const sy = Math.floor((tileID - 1) / genus.spritesheetWidth) * genus.size; // determines row on spritesheet
          const dx = i % screen.frames.col * genus.size;
          const dy = Math.floor(i / screen.frames.col) * genus.size;
          
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
                sx: sx,
                sy: sy
              },
              destination: {
                dx: dx,
                dy: dy
              },
              size: 64
            });
            wateries.push(water);
          };

          // Check for collision tiles
          if (tileID === 25) { 
            const boundary = new Tile({
              destination: { dx: dx, dy: dy }
            });
            boundaries.push(boundary);
          } else {
            ctx.drawImage(genus, sx, sy, genus.size, genus.size, dx, dy, genus.size, genus.size);
          };
        };
      });
    }); // Iterate through visibleMapSection to differentiate tiles and draw first layer

    // Draw objects that are located on visible screen
    items.forEach(item => {
      if (
        item.dx > 0 &&
        item.dx + item.size < screen.width &&
        item.dy > 0 &&
        item.dy + item.size < screen.height
      ) {
        item.draw(ctx);
      };
    });

    if (currentMenu === 'inventorybtn') {
      equipped.forEach(item => {
        item.draw(ctx);
      });
    };
    // Draw player after drawing minimap and items
    player.draw(ctx);
    
    // Draw uppermost layer after map, player, and items
    uppermost.forEach(tile => {
      ctx.drawImage( genus, tile.source.usx, tile.source.usy, tile.size, tile.size, tile.destination.udx, tile.destination.udy, tile.size, tile.size );
    });
  };

  const collisionDetect = (newX, newY) => {
    for (let i = 0 ; i < boundaries.length ; i++) {
      const boundary = boundaries[i];

      if (
        newX < boundary.destination.dx + boundary.size &&
        newX + player.size > boundary.destination.dx &&
        newY < boundary.destination.dy + boundary.size &&
        newY + player.size > boundary.destination.dy
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
        newX < water.destination.dx + water.size &&
        newX + player.size > water.destination.dx &&
        newY < water.destination.dy + water.size &&
        newY + player.size > water.destination.dy
      ) {
        return true;
      };
    };
    return false;
  };

  // Handle Right Side UI
  const drawRightSideUI = () => {
    ctx.clearRect(screen.width, 0, 192, 704);
    drawGenus({ player });
    switch(currentMenu) {
      case 'mapbtn':
        drawMenuSection(currentMenu);
        drawMapContentSection();
        break;
      case 'inventorybtn':
        drawMenuSection(currentMenu);
        drawEquipmentSection();
        drawInventorySection();
      break;
      case 'listbtn':
        drawMenuSection(currentMenu);
        drawStanceSection(0, 0, player.data.performance.stance);
        break;
      default: break;
    };
  };
  
  const drawMenuSection = (string) => {
    let current;
    switch(string) {
      case 'mapbtn':
        current = ui.buttons.menu.mapbtn;
        break;
      case 'inventorybtn':
        current = ui.buttons.menu.inventorybtn;
        break;
      case 'listbtn':
        current = ui.buttons.menu.listbtn;
        break;
      default: 
        current = ui.buttons.menu.inventorybtn;
        break;
    };
    
    // draw menu background
    ctx.drawImage( ui, 0, 192, 192, 64, screen.width, 192, 192, 64 );

    // draw selected indicator
    ctx.drawImage( ui, 128, 256, 34, 34, current.dx - 1, current.dy - 1, 34, 34 );

    // draw button images
    for (const key in ui.buttons.menu) {
      const btn = ui.buttons.menu[key];
      ctx.drawImage(ui, btn.sx, btn.sy, btn.size, btn.size, btn.dx, btn.dy, btn.size, btn.size);
    };
  };

  const checkMenuToggle = (mouseX, mouseY) => {
    if (
      mouseX >= ui.buttons.menu.mapbtn.dx &&
      mouseX <= ui.buttons.menu.mapbtn.dx + ui.buttons.menu.mapbtn.size &&
      mouseY >= ui.buttons.menu.mapbtn.dy &&
      mouseY <= ui.buttons.menu.mapbtn.dy + ui.buttons.menu.mapbtn.size
    ) {
      return 'mapbtn';
    };

    if (
      mouseX >= ui.buttons.menu.inventorybtn.dx &&
      mouseX <= ui.buttons.menu.inventorybtn.dx + ui.buttons.menu.inventorybtn.size &&
      mouseY >= ui.buttons.menu.inventorybtn.dy &&
      mouseY <= ui.buttons.menu.inventorybtn.dy + ui.buttons.menu.inventorybtn.size
    ) {
      return 'inventorybtn';
    };

    if (
      mouseX >= ui.buttons.menu.listbtn.dx &&
      mouseX <= ui.buttons.menu.listbtn.dx + ui.buttons.menu.listbtn.size &&
      mouseY >= ui.buttons.menu.listbtn.dy &&
      mouseY <= ui.buttons.menu.listbtn.dy + ui.buttons.menu.listbtn.size
      ) {
      return 'listbtn';
    };
  };
  
  // Right Side - Map Section
  const drawMapContentSection = () => {
    if (currentMenu === 'mapbtn') {
      ctx.clearRect(screen.width, 0, 192, 192);
      ctx.clearRect(screen.width, 256, 192, 448);
      ctx.drawImage(mapModal, 0, 0, 1200, 1300, 128, 20, screen.width - 230, screen.height - 40);
      ctx.font = '1.5rem Arial';
      ctx.fillStyle = '#fff';
      ctx.fillText('Genus Island', screen.width + 20, 50);
      ctx.font = '1rem Arial';
      ctx.fillText('Town and Outskirts', screen.width + 20, 80);
      if (!mapContentButton) {
        ctx.drawImage(ui, ui.buttons.mapSectionScroll.activeUp.sx, ui.buttons.mapSectionScroll.activeUp.sy, ui.buttons.mapSectionScroll.activeUp.size, ui.buttons.mapSectionScroll.activeUp.size, ui.buttons.mapSectionScroll.activeUp.dx, ui.buttons.mapSectionScroll.activeUp.dy, ui.buttons.mapSectionScroll.activeUp.size, ui.buttons.mapSectionScroll.activeUp.size);
        ctx.drawImage(ui, ui.buttons.mapSectionScroll.inactiveDown.sx, ui.buttons.mapSectionScroll.inactiveDown.sy, ui.buttons.mapSectionScroll.inactiveDown.size, ui.buttons.mapSectionScroll.inactiveDown.size, ui.buttons.mapSectionScroll.inactiveDown.dx, ui.buttons.mapSectionScroll.inactiveDown.dy, ui.buttons.mapSectionScroll.inactiveDown.size, ui.buttons.mapSectionScroll.inactiveDown.size);
        let keyCount = 0;
        
        ctx.font = '0.8rem Arial';
        ctx.fillText("Genus Island Contents", screen.width + 15, 286);
  
        for (const key in mapContentsGenus) {
          if (mapContentsGenus[key].x) {
            delete mapContentsGenus[key].x;
            delete mapContentsGenus[key].y;
          };
  
          if (mapContentsGenus.hasOwnProperty(key)) {
            const mapX = screen.width + 25, mapY = 310 + (20 * keyCount);
            ctx.fillText(mapContentsGenus[key].area, mapX, mapY);
            mapContentsGenus[key].x = mapX;
            mapContentsGenus[key].y = mapY - 12;
            mapContentsGenus[key].width = 130;
            mapContentsGenus[key].height = 20;
          };
  
          keyCount++;
  
          if(keyCount === 20) break;
        }; 
      } else if (mapContentButton) {
        ctx.drawImage( ui, ui.buttons.mapSectionScroll.inactiveUp.sx, ui.buttons.mapSectionScroll.inactiveUp.sy, ui.buttons.mapSectionScroll.inactiveUp.size, ui.buttons.mapSectionScroll.inactiveUp.size, ui.buttons.mapSectionScroll.inactiveUp.dx, ui.buttons.mapSectionScroll.inactiveUp.dy, ui.buttons.mapSectionScroll.inactiveUp.size, ui.buttons.mapSectionScroll.inactiveUp.size );
        ctx.drawImage( ui, ui.buttons.mapSectionScroll.activeDown.sx, ui.buttons.mapSectionScroll.activeDown.sy, ui.buttons.mapSectionScroll.activeDown.size, ui.buttons.mapSectionScroll.activeDown.size, ui.buttons.mapSectionScroll.activeDown.dx, ui.buttons.mapSectionScroll.activeDown.dy, ui.buttons.mapSectionScroll.activeDown.size, ui.buttons.mapSectionScroll.activeDown.size );
        let keyCount = 0, yAxis = 0;
  
        ctx.font = '0.8rem Arial';
        ctx.fillText("Genus Island Contents", screen.width + 15, 286);
  
        for (const key in mapContentsGenus) {
          if (mapContentsGenus[key].x) {
            delete mapContentsGenus[key].x;
            delete mapContentsGenus[key].y;
          };
  
          if (mapContentsGenus.hasOwnProperty(key)) {
            keyCount++;
          };
  
          if (keyCount > 20) {
            const mapX = screen.width + 25, mapY = 310 + (20 * yAxis);
            ctx.fillText(mapContentsGenus[key].area, mapX, mapY);
  
            mapContentsGenus[key].x = mapX;
            mapContentsGenus[key].y = mapY - 12;
            mapContentsGenus[key].width = 130;
            mapContentsGenus[key].height = 20;
            yAxis++;
          };
  
          if (keyCount >= 26) break;
        };
      };
    };
  };

  const isMouseOverButton = (mouseX, mouseY, button) => {
    return (
      mouseX >= button.dx &&
      mouseX <= button.dx + button.size &&
      mouseY >= button.dy &&
      mouseY <= button.dy + button.size
    );
  };

  const findContentUnderMouse = (mouseX, mouseY) => {
    for (const key in mapContentsGenus) {
      const content = mapContentsGenus[key];
      if (isMouseOverContent(mouseX, mouseY, content)) {
        return content;
      };
    };
    return null;
  };

  const isMouseOverContent = (mouseX, mouseY, content) => {
    return (
      mouseX >= content.x &&
      mouseX <= content.x + content.width &&
      mouseY >= content.y &&
      mouseY <= content.y + content.height
    );
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

  // Right Side - Inventory Section
  const drawEquipmentSection = () => {
    if (currentMenu === 'inventorybtn') {
      ctx.clearRect(screen.width, 0, 192, 192);
      ctx.drawImage(ui, 0, 0, 192, 192, screen.width, 0, 192, 192);
      equipped.forEach(item => item.draw(ctx));
    };
  };

  const isInEquipmentSection = (item) => {
    return (
      item.dx + item.size > screen.width &&
      item.dx < screen.width + 192 &&
      item.dy + item.size > 0 &&
      item.dy < 192
    );
  };

  const handleEquipping = (item) => {
    if (currentMenu === 'inventorybtn') {
      switch(item.type) {
        case 'neck':
          if (player.data.performance.equipped.neck !== 'empty') {
            const prev = equipped.find(gear => gear.id === player.data.performance.equipped.neck.id);
            prev.dx = originalItemPosition.x;
            prev.dy = originalItemPosition.y;
            prev.scale = 1;
            items.push(prev);
            equipped.splice(equipped.indexOf(prev), 1);
          };

          player.data.performance.equipped.neck = item;
          item.dx = equipmentSlotLocations.neck.x;
          item.dy = equipmentSlotLocations.neck.y;
          item.scale = 0.5;
          equipped.push(item);
          items.splice(items.indexOf(item), 1);
          drawEquipmentSection();

          break;
        case 'head':
          if (player.data.performance.equipped.head !== 'empty') {
            const prev = equipped.find(gear => gear.id === player.data.performance.equipped.head.id);
            prev.dx = originalItemPosition.x;
            prev.dy = originalItemPosition.y;
            prev.scale = 1;
            items.push(prev);
            equipped.splice(equipped.indexOf(prev), 1);
          };

          player.data.performance.equipped.head = item;
          item.dx = equipmentSlotLocations.head.x;
          item.dy = equipmentSlotLocations.head.y;
          item.scale = 0.5;
          equipped.push(item);
          items.splice(items.indexOf(item), 1);
          drawEquipmentSection();
          
          break;
        case 'back':
          if (player.data.performance.equipped.back !== 'empty') {
            const prev = equipped.find(gear => gear.id === player.data.performance.equipped.back.id);
            prev.dx = originalItemPosition.x;
            prev.dy = originalItemPosition.y;
            prev.scale = 1;
            items.push(prev);
            equipped.splice(equipped.indexOf(prev), 1);
          };

          player.data.performance.equipped.back = item;
          item.dx = equipmentSlotLocations.back.x;
          item.dy = equipmentSlotLocations.back.y;
          item.scale = 0.5;
          equipped.push(item);
          items.splice(items.indexOf(item), 1);
          drawEquipmentSection();
          
          break;
        case 'chest':
          if (player.data.performance.equipped.chest !== 'empty') {
            const prev = equipped.find(gear => gear.id === player.data.performance.equipped.chest.id);
            prev.dx = originalItemPosition.x;
            prev.dy = originalItemPosition.y;
            prev.scale = 1;
            items.push(prev);
            equipped.splice(equipped.indexOf(prev), 1);
          };

          player.data.performance.equipped.chest = item;
          item.dx = equipmentSlotLocations.chest.x;
          item.dy = equipmentSlotLocations.chest.y;
          item.scale = 0.5;
          equipped.push(item);
          items.splice(items.indexOf(item), 1);
          drawEquipmentSection();
          
          break;
        case 'offhand':
          if (player.data.performance.equipped.offhand !== 'empty') {
            const prev = equipped.find(gear => gear.id === player.data.performance.equipped.offhand.id);
            prev.dx = originalItemPosition.x;
            prev.dy = originalItemPosition.y;
            prev.scale = 1;
            items.push(prev);
            equipped.splice(equipped.indexOf(prev), 1);
          };

          player.data.performance.equipped.offhand = item;
          item.dx = equipmentSlotLocations.offhand.x;
          item.dy = equipmentSlotLocations.offhand.y;
          item.scale = 0.5;
          equipped.push(item);
          items.splice(items.indexOf(item), 1);
          drawEquipmentSection();
          
          break;
        case 'mainhand':
          if (player.data.performance.equipped.mainhand !== 'empty') {
            const prev = equipped.find(gear => gear.id === player.data.performance.equipped.mainhand.id);
            prev.dx = originalItemPosition.x;
            prev.dy = originalItemPosition.y;
            prev.scale = 1;
            items.push(prev);
            equipped.splice(equipped.indexOf(prev), 1);
          };

          player.data.performance.equipped.mainhand = item;
          item.dx = equipmentSlotLocations.mainhand.x;
          item.dy = equipmentSlotLocations.mainhand.y;
          item.scale = 0.5;
          equipped.push(item);
          items.splice(items.indexOf(item), 1);
          drawEquipmentSection();
          
          break;
        case 'legs':
          if (player.data.performance.equipped.legs !== 'empty') {
            const prev = equipped.find(gear => gear.id === player.data.performance.equipped.legs.id);
            prev.dx = originalItemPosition.x;
            prev.dy = originalItemPosition.y;
            prev.scale = 1;
            items.push(prev);
            equipped.splice(equipped.indexOf(prev), 1);
          };

          player.data.performance.equipped.legs = item;
          item.dx = equipmentSlotLocations.legs.x;
          item.dy = equipmentSlotLocations.legs.y;
          item.scale = 0.5;
          equipped.push(item);
          items.splice(items.indexOf(item), 1);
          drawEquipmentSection();
          
          break;
        case 'feet':
          if (player.data.performance.equipped.feet !== 'empty') {
            const prev = equipped.find(gear => gear.id === player.data.performance.equipped.feet.id);
            prev.dx = originalItemPosition.x;
            prev.dy = originalItemPosition.y;
            prev.scale = 1;
            items.push(prev);
            equipped.splice(equipped.indexOf(prev), 1);
          };

          player.data.performance.equipped.feet = item;
          item.dx = equipmentSlotLocations.feet.x;
          item.dy = equipmentSlotLocations.feet.y;
          item.scale = 0.5;
          equipped.push(item);
          items.splice(items.indexOf(item), 1);
          drawEquipmentSection();
          
          break;
        default: break;
      };
    };
  };

  const resetEquipmentSlot = (item) => {
    switch(item.type) {
      case 'neck':
        player.data.performance.equipped.neck = 'empty';
        break;
      case 'head':
        player.data.performance.equipped.head = 'empty';
        break;
      case 'back':
        player.data.performance.equipped.back = 'empty';
        break;
      case 'chest':
        player.data.performance.equipped.chest = 'empty';
        break;
      case 'offhand':
        player.data.performance.equipped.offhand = 'empty';
        break;
      case 'mainhand':
        player.data.performance.equipped.mainhand = 'empty';
        break;
      case 'legs':
        player.data.performance.equipped.legs = 'empty';
        break;
      case 'feet':
        player.data.performance.equipped.feet = 'empty';
        break;
      default: break;
    };
  };

  const drawInventorySection = () => {
    if (currentMenu === 'inventorybtn') {
      const backItem = player.data.performance.equipped.back;
      ctx.clearRect(screen.width, 256, 192, canvas.height - 256);
      ctx.fillStyle = '#fff';
      // ctx.fillRect(screen.width, 256, 192, 160); // 160 (24 slot) - 224 (36 slot) - 224 (depot 36 slot)
      switch(backItem.name) {
        case 'backpack':
          inventoryContainerSizes.open.backpack = true;
          ctx.fillRect(screen.width, 256, 192, 160); // 160 (24 slot) - 224 (36 slot) - 224 (depot 36 slot)
          ctx.drawImage(ui, ui.containers.backpack.x, ui.containers.backpack.y, ui.containers.backpack.size, ui.containers.backpack.size, inventoryContainerSizes.inventorySection.x, inventoryContainerSizes.inventorySection.y, ui.containers.backpack.size, ui.containers.backpack.size);
          break;
        case 'labeledbackpack':
          inventoryContainerSizes.open.backpack = true;
          ctx.drawImage(ui, ui.containers.labeledbackpack.x, ui.containers.labeledbackpack.y, ui.containers.labeledbackpack.size, ui.containers.labeledbackpack.size, inventoryContainerSizes.inventorySection.x, inventoryContainerSizes.inventorySection.y, ui.containers.labeledbackpack.size, ui.containers.labeledbackpack.size);
          break;
        case 'enchantedbackpack':
          inventoryContainerSizes.open.backpack = true;
          ctx.drawImage(ui, ui.containers.enchantedbackpack.x, ui.containers.enchantedbackpack.y, ui.containers.enchantedbackpack.size, ui.containers.enchantedbackpack.size, inventoryContainerSizes.inventorySection.x, inventoryContainerSizes.inventorySection.y, ui.containers.enchantedbackpack.size, ui.containers.enchantedbackpack.size);
          break;
        case 'labeledenchantedbackpack':
          inventoryContainerSizes.open.backpack = true;
          ctx.drawImage(ui, ui.containers.labeledenchantedbackpack.x, ui.containers.labeledenchantedbackpack.y, ui.containers.labeledenchantedbackpack.size, ui.containers.labeledenchantedbackpack.size, inventoryContainerSizes.inventorySection.x, inventoryContainerSizes.inventorySection.y, ui.containers.labeledenchantedbackpack.size, ui.containers.labeledenchantedbackpack.size);
          break;
        default:
          inventoryContainerSizes.open.backpack = false;
          const message = '< no backpack equipped >';
          ctx.fillStyle = 'black';
          ctx.fillText(message, screen.width + 4, 270);
          break;
      };

      for (let i = 0 ; i < backItem.slots ; i++) {
        const x = i % 6 * 32;
        const y = Math.floor(i / 6) * 32;

        // no inventory, no container
        if (!inventoryContainerSizes.open.backpack && !inventoryContainerSizes.open.container) {

        // yes inventory, no container
        } else if (inventoryContainerSizes.open.backpack && !inventoryContainerSizes.open.container) {
          ctx.drawImage(ui, 64, 288, 32, 32, screen.width + x, 289 + y, 32, 32);
          if (inventory[i]) {
            const item = inventory[i];
            item.dx = screen.width + x;
            item.dy = 295 + y;
            item.scale = 0.5;
            ctx.drawImage(item.image, item.sx, item.sy, item.size, item.size, item.dx, item.dy, item.size * item.scale, item.size * item.scale);
          };
        // yes inventory, yes container
        } else if (inventoryContainerSizes.open.backpack && inventoryContainerSizes.open.container) {

        // no inventory, yes container
        } else if (!inventoryContainerSizes.open.backpack && inventoryContainerSizes.open.container) {

        };
      };

      // const inventoryContainerSizes = {
      //   location: { x: screen.width, y: 256, width: 192, height: 169},
      //   inventorySection: { x: screen.width, y: 256 }, 
      //   containerSection: { x: screen.width, y: 416 },
      //   open: { backpack: false, container: false }
      // };

      // ui.containers = {
      //   backpack: { x: 0, y: 32 * 8, size: 32 },
      //   labeledbackpack: { x: 0, y: 32 * 9, size: 32 },
      //   enchantedbackpack: { x: 32, y: 32 * 8, size: 32 },
      //   labeledenchantedbackpack: { x: 32, y: 32 * 9, size: 32 },
      //   depot: { x: 64, y: 32 * 8, size: 32 },
      // };
    };
  };

  const handleInventory = (mouseX, mouseY, item) => {
    const backItem = player.data.performance.equipped.back;
    for (let i = 0 ; i < backItem.slots ; i++) {
      const x = i % 6 * 32;
      const y = Math.floor(i / 6) * 32;
    };
  };

  // Right Side - Enemy Section
  const drawStanceSection = (mouseX, mouseY, stance) => {
    if (currentMenu === 'listbtn') {
      ctx.clearRect(screen.width, 640, 192, 64);
      ctx.drawImage(ui, ui.buttons.stances.attackInactive.sx, ui.buttons.stances.attackInactive.sy, 96, 32, screen.width, 640, 192, 64);
      switch(stance) {
        case 'aggressive':
          player.data.performance.stance = 'aggressive';
          ctx.drawImage(
            ui,
            ui.buttons.stances.attackActive.sx,
            ui.buttons.stances.attackActive.sy,
            ui.buttons.stances.attackActive.size,
            ui.buttons.stances.attackActive.size,
            ui.buttons.stances.attackActive.dx,
            ui.buttons.stances.attackActive.dy,
            ui.buttons.stances.attackActive.size * ui.buttons.stances.attackActive.scale,
            ui.buttons.stances.attackActive.size * ui.buttons.stances.attackActive.scale
          );
          break;
        case 'defensive':
          player.data.performance.stance = 'defensive';
          ctx.drawImage(
            ui,
            ui.buttons.stances.defendActive.sx,
            ui.buttons.stances.defendActive.sy,
            ui.buttons.stances.defendActive.size,
            ui.buttons.stances.defendActive.size,
            ui.buttons.stances.defendActive.dx,
            ui.buttons.stances.defendActive.dy,
            ui.buttons.stances.defendActive.size * ui.buttons.stances.defendActive.scale,
            ui.buttons.stances.defendActive.size * ui.buttons.stances.defendActive.scale
          );
          break;
        case 'passive':
          player.data.performance.stance = 'passive';
          ctx.drawImage(
            ui,
            ui.buttons.stances.passiveActive.sx,
            ui.buttons.stances.passiveActive.sy,
            ui.buttons.stances.passiveActive.size,
            ui.buttons.stances.passiveActive.size,
            ui.buttons.stances.passiveActive.dx,
            ui.buttons.stances.passiveActive.dy,
            ui.buttons.stances.passiveActive.size * ui.buttons.stances.passiveActive.scale,
            ui.buttons.stances.passiveActive.size * ui.buttons.stances.passiveActive.scale
          );
          break;
        default: break;
      };
    };
  };

  const checkStance = (mouseX, mouseY) => {
    if (currentMenu === 'listbtn') {
      if (
        mouseX >= ui.buttons.stances.attackInactive.dx &&
        mouseX <= ui.buttons.stances.attackInactive.dx + ui.buttons.stances.attackInactive.size * ui.buttons.stances.attackInactive.scale &&
        mouseY >= ui.buttons.stances.attackInactive.dy &&
        mouseY <= ui.buttons.stances.attackInactive.dy + ui.buttons.stances.attackInactive.size * ui.buttons.stances.attackInactive.scale
      ) {
        return 'aggressive';
      };
  
      if (
        mouseX >= ui.buttons.stances.defendInactive.dx &&
        mouseX <= ui.buttons.stances.defendInactive.dx + ui.buttons.stances.defendInactive.size * ui.buttons.stances.defendInactive.scale &&
        mouseY >= ui.buttons.stances.defendInactive.dy &&
        mouseY <= ui.buttons.stances.defendInactive.dy + ui.buttons.stances.defendInactive.size * ui.buttons.stances.defendInactive.scale
      ) {
        return 'defensive';
      };
  
      if (
        mouseX >= ui.buttons.stances.passiveInactive.dx &&
        mouseX <= ui.buttons.stances.passiveInactive.dx + ui.buttons.stances.passiveInactive.size * ui.buttons.stances.passiveInactive.scale &&
        mouseY >= ui.buttons.stances.passiveInactive.dy &&
        mouseY <= ui.buttons.stances.passiveInactive.dy + ui.buttons.stances.passiveInactive.size * ui.buttons.stances.passiveInactive.scale
      ) {
        return 'passive';
      };
    };
  };

  // Create Items
  const initItem = (id, type, name, sx, sy, dx, dy, scale = 1) => {
    const rpgItem = new Item(id, type, name, sx, sy, dx, dy, scale);
    
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

    if (isInEquipmentSection(rpgItem)) {
      equipped.push(rpgItem);
    } else {
      items.push(rpgItem);
    };
  };

  // Move Items In Range of Player
  const isInRangeOfPlayer = (objX, objY) => {
    return (
      objX >= screen.width / 2 - 96 &&
      objX < screen.width / 2 + 96 &&
      objY >= screen.height / 2 - 96 &&
      objY < screen.height / 2 + 96
    );
  };
  
  const isMouseOverItem = (mouseX, mouseY, item) => {
    return (
      mouseX >= item.dx &&
      mouseX <= item.dx + item.size * item.scale &&
      mouseY >= item.dy &&
      mouseY <= item.dy + item.size * item.scale
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
  
  // Event Listeners
  addEventListener('mousedown', (e) => {
    if (form.closed) {
      const mouseX = e.clientX - canvas.getBoundingClientRect().left;
      const mouseY = e.clientY - canvas.getBoundingClientRect().top;
      const selectedItem = findItemUnderMouse(mouseX, mouseY, items);
      const equippedItem = findItemUnderMouse(mouseX, mouseY, equipped);
      
      if (currentMenu === 'inventorybtn' && equippedItem) {
        equippedItem.isDragging = true;
        canvas.style.cursor = 'grabbing';
        originalItemPosition = {
          x: equippedItem.dx,
          y: equippedItem.dy
        }; 
      };
  
      if (selectedItem && isInRangeOfPlayer(selectedItem.dx, selectedItem.dy)) {
        selectedItem.isDragging = true;
        canvas.style.cursor = 'grabbing';
        originalItemPosition = {
          x: selectedItem.dx,
          y: selectedItem.dy
        };
      };
  
      if (checkMenuToggle(mouseX, mouseY)) {
        currentMenu = checkMenuToggle(mouseX, mouseY);
        drawRightSideUI();
      };
  
      for (const btn in ui.buttons.mapSectionScroll) {
        if (isMouseOverButton(mouseX, mouseY, ui.buttons.mapSectionScroll[btn])) {
          if (btn == 'activeDown') {
            mapContentButton = true;
            ctx.clearRect(screen.width, 256, 192, 448);
            drawMapContentSection();
          } else {
            mapContentButton = false;
            ctx.clearRect(screen.width, 256, 192, 448);
            drawMapContentSection();
          };
        };
      };
      
      if (currentMenu === 'listbtn' && checkStance(mouseX, mouseY)) {
        player.data.performance.stance = checkStance(mouseX, mouseY);
        drawStanceSection(mouseX, mouseY, player.data.performance.stance);
      };
    };
  });
  
  addEventListener('mousemove', (e) => {
    if (form.closed) {
      const mouseX = e.clientX - canvas.getBoundingClientRect().left;
      const mouseY = e.clientY - canvas.getBoundingClientRect().top;
      const selectedItem = findItemUnderMouse(mouseX, mouseY, items);

      if (selectedItem && !selectedItem.isDragging && currentMenu !== 'mapbtn') {
        switch(selectedItem.type) {
          case 'back':
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
          case 'head':
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
        items.splice(items.indexOf(selectedItem), 1);
        items.push(selectedItem);      
      };

      if (currentMenu === 'mapbtn') {
        const content = findContentUnderMouse(mouseX, mouseY);
        
        if (content) {
          ctx.clearRect(150, 20, screen.width - 300, screen.height - 40);  
          fillLinesOfText(content.area, content.description, 26);
          ctx.drawImage(mapModal, 0, 0, 1200, 1300, 128, 20, screen.width - 230, screen.height - 40);
          ctx.drawImage(ui, 96, 288, 32, 32, content.mapx, content.mapy, 32, 32)
        };
      };
    };
  });
  
  addEventListener('mouseup', (e) => {
    if (form.closed) {
      if (currentMenu === 'inventorybtn') {
        equipped.forEach(item => {
          if (item.isDragging) {
            let posX = e.clientX - canvas.getBoundingClientRect().left;
            let posY = e.clientY - canvas.getBoundingClientRect().top;
            item.dx = Math.floor(posX / 64) * 64;
            item.dy = Math.floor(posY / 64) * 64;

            if (waterDetect(item.dx, item.dy)) {
              resetEquipmentSlot(item);
              equipped.splice(equipped.indexOf(item), 1);
              drawEquipmentSection();
            } else if (collisionDetect(item.dx, item.dy)) {
              item.dx = originalItemPosition.x;
              item.dy = originalItemPosition.y;
              item.isDragging = false;
            } else if (
              item.dx + item.size < screen.width &&
              item.dx > 0 &&
              item.dy + item.size < screen.height &&
              item.dy > 0 &&
              collisionDetect(item.dx, item.dy) === false
            ) {
              item.scale = 1;
              item.isDragging = false;
              resetEquipmentSlot(item);
              items.push(item);
              equipped.splice(equipped.indexOf(item), 1);              
              drawGenus({ player });
              drawEquipmentSection();
            };
          };
        });
      };

      items.forEach(item => {
        if (item.isDragging && isInRangeOfPlayer(item.dx, item.dy)) {
          let posX = e.clientX - canvas.getBoundingClientRect().left;
          let posY = e.clientY - canvas.getBoundingClientRect().top;
          item.dx = Math.floor(posX / 64) * 64;
          item.dy = Math.floor(posY / 64) * 64;
          
          if (isInEquipmentSection(item)) {
            handleEquipping(item);
          } else if (waterDetect(item.dx, item.dy)) {
            items.splice(items.indexOf(item), 1);
          } else if (
            collisionDetect(item.dx, item.dy)
          ) {
            item.dx = originalItemPosition.x;
            item.dy = originalItemPosition.y;
          };
          
          item.isDragging = false;
          drawGenus({ player });
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
          newY -= player.size;
          valY--;
          break;
          
        case 's' :
          player.direction = player.source.downward;
          newY += player.size;
          valY++;
          break;
          
        case 'a' :
          player.direction = player.source.leftward;
          newX -= player.size;
          valX--;
          break;
          
        case 'd' :
          player.direction = player.source.rightward;
          newX += player.size;
          valX++;
          break;
          
        default: break;
      };

      if (!collisionDetect(newX, newY)) {
        // update player location in world
        player.data.performance.location.x += valX;
        player.data.performance.location.y += valY;
        // update object's locations in world
        items.forEach(item => {
          item.dx -= valX * item.size * item.scale;
          item.dy -= valY * item.size * item.scale;
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
      items.length + 1,
      'head',
      'hood', 
      0,
      0, 
      256,
      256
    );
    // item 2
    initItem(
      items.length + 1,
      'chest',
      'tunic', 
      64,
      0,
      256,
      320
    );
    // item 3
    initItem(
      items.length + 1,
      'legs',
      'pants', 
      128,
      0,
      256,
      384
    );
    // item 4
    initItem(
      items.length + 1,
      'neck',
      'fanged', 
      448,
      128, 
      192,
      256
    );
    // item 5
    initItem(
      items.length + 1,
      'mainhand',
      'sword', 
      320,
      64,
      192,
      320
    );
    // item 6
    initItem(
      items.length + 1,
      'offhand',
      'kite', 
      576,
      64,
      320,
      320
    );
    // item 7
    initItem(
      items.length + 1,
      'feet',
      'shoes', 
      192,
      0,
      256,
      448  
    );
    // item 8
    initItem(
      items.length + 1,
      'back',
      'backpack', 
      0, 
      448,
      320,
      256
    );
  }, 500);

  setTimeout(() => {
    // item 1
    initItem(
      items.length + 1,
      'head',
      'coif', 
      0,
      128, 
      512,
      256
    );
    // item 2
    initItem(
      items.length + 1,
      'chest',
      'chainmail', 
      64,
      128,
      512,
      320
    );
    // item 3
    initItem(
      items.length + 1,
      'legs',
      'chainmail kilt', 
      128,
      128,
      512,
      384
    );
    // item 4
    initItem(
      items.length + 1,
      'neck',
      'silver', 
      512,
      128, 
      448,
      256
    );
    // item 5
    initItem(
      items.length + 1,
      'mainhand',
      'spear', 
      512,
      64,
      448,
      320
    );
    // item 6
    initItem(
      items.length + 1,
      'offhand',
      'heater', 
      576,
      128,
      576,
      320
    );
    // item 7
    initItem(
      items.length + 1,
      'feet',
      'chausses', 
      192,
      128,
      512,
      448  
    );
    // item 8
    // inventory.push(initItem(
    //   items.length + 1,
    //   'neck',
    //   'silver', 
    //   512,
    //   128, 
    //   448,
    //   256
    // ));
  }, 500);
});