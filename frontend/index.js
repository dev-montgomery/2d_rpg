import { resources } from './src/Resources.js';
// import { Sprite } from './src/Classes.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1600;
canvas.height = 960;

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const genus = {
  image: new Image(),
  src: './assets/spritesheet-genus.png',
  width: 20,
  height: 20,
  frameSize: 32
};

genus.onload = (currentMap = resources.mapData.isLoaded && resources.mapData.genus01.layers) => {
  console.log(currentMap)
};

function animate () {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);  
};

animate();
  // let oceanTiles = [];
    // currentMap.forEach(layer => {
    //   let dx = 0;
    //   let dy = 0;
    //   console.log(dx, dy)  
    //   layer.data.forEach(tileID => {
    //     if (tileID > 0) {
    //       // if (tileID === ocean tileID) {
    //       //   oceanTiles.push(tileID)
    //       // } else {
  
    //       // }
    //       let sx = tileID -1, sy = 0;
  
    //       if (sx > resources.spritesheet.width) {
    //         sx = (sx % resources.spritesheet.width);
    //         sy = Math.floor(tileID / resources.spritesheet.width);
    //       };
  
    //       ctx.drawImage(
    //         resources.spritesheet,
    //         sx * resources.frameSize,
    //         sy * resources.frameSize,
    //         resources.frameSize,
    //         resources.frameSize,
    //         dx * resources.frameSize,
    //         dy * resources.frameSize,
    //         resources.frameSize,
    //         resources.frameSize
    //       );
    //     };
    //     if (dx === 50) {
    //       dy++;
    //       dx = 0;
    //     };
    //     dx++;
    //   });
    //   // Do something with oceantiles
    // });   

// Draw Map | Update Map
// const drawMap = (currentMap = resources.mapData.isLoaded && resources.mapData.genus01.layers) => {
//   // canvas.width = resources.mapData.isLoaded && currentMap[0].width * resources.frameSize;
//   // canvas.height = resources.mapData.isLoaded && currentMap[0].height * resources.frameSize;
//   // console.log(canvas.width, canvas.height)
//   // let oceanTiles = [];

//   currentMap.forEach(layer => {
//     let dx = 0;
//     let dy = 0;
//     console.log(dx, dy)  
//     layer.data.forEach(tileID => {
//       if (tileID > 0) {
//         // if (tileID === ocean tileID) {
//         //   oceanTiles.push(tileID)
//         // } else {

//         // }
//         let sx = tileID -1, sy = 0;

//         if (sx > resources.spritesheet.width) {
//           sx = (sx % resources.spritesheet.width);
//           sy = Math.floor(tileID / resources.spritesheet.width);
//         };

//         ctx.drawImage(
//           resources.spritesheet,
//           sx * resources.frameSize,
//           sy * resources.frameSize,
//           resources.frameSize,
//           resources.frameSize,
//           dx * resources.frameSize,
//           dy * resources.frameSize,
//           resources.frameSize,
//           resources.frameSize
//         );
//       };
//       if (dx === 50) {
//         dy++;
//         dx = 0;
//       };
//       dx++;
//     });
//     // Do something with oceantiles
//   });
// };

// const directions = {
//   up: { pressed: false },
//   down: { pressed: false },
//   left: { pressed: false },
//   right: { pressed: false }
// };

// const chatbox = false;

// // Event Listeners for player mobility
// addEventListener('keydown', (e) => {
//   if (!chatbox) {
//     switch(e.key) {
//       case 'w' :
//         directions.up.pressed = true;
//         player.currentDirection = player.sprite.direction.backward;
//         player.move.y = -1;
//         break;
//       case 's' :
//         directions.down.pressed = true;
//         player.currentDirection = player.sprite.direction.forward;
//         player.move.y = 1;
//         break;
//       case 'a' :
//         directions.left.pressed = true;
//         player.currentDirection = player.sprite.direction.left;
//         player.move.x = -1;
//         break;
//       case 'd' :
//         directions.right.pressed = true;
//         player.currentDirection = player.sprite.direction.right;
//         player.move.x = 1;
//         break;
//       default: break;
//     };
//   };
// });

// addEventListener('keyup', (e) => {
//   if (!chatbox) {
//     switch(e.key) {
//       case 'w' :
//         directions.up.pressed = false;
//         player.move.y = 0;
//         break;
//       case 's' :
//         directions.down.pressed = false;
//         player.move.y = 0;
//         break;
//       case 'a' :
//         directions.left.pressed = false;
//         player.move.x = 0;
//         break;
//       case 'd' :
//         directions.right.pressed = false;
//         player.move.x = 0;
//         break;
//       default: break;
//     };
//   };
// });

// addEventListener('resize', drawMap);

// player movement
// make player center of screen
// map update beyond axis
// create collision areas

// make map larger

// inventory functionality
// equipping items
// depot box function
// mailbox function
// trash function
// fishing function
// npcs
// stairs map update
// attack functions
// determine skills and lvl algorythems
// learn how to spell algorithyms


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