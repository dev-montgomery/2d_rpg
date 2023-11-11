export class Player {
  constructor() {
    this.sprite = new Image();
    this.sprite.src = './assets/spritesheet-npcs.png';
    this.sprite.onload = () => {
      this.isLoaded = true;
    };
    this.sprite.direction = {
      forward: { x: 0, y: 0 },
      backward: { x: 0, y: 32 },
      right: { x: 32, y: 0 },
      left: { x: 32, y: 32 }
    }
    this.pixelSize = 32;
    this.dx = 100; // Draw starting location in the middle of the map
    this.dy = 100;
    this.move = {
      x: 0,
      y: 0
    };
    this.currentDirection = this.sprite.direction.forward;
  };

  draw = (ctx) => {
    this.isLoaded && ctx.drawImage(
      this.sprite,
      this.currentDirection.x,
      this.currentDirection.y,
      this.pixelSize,
      this.pixelSize,
      this.dx,
      this.dy,
      this.pixelSize,
      this.pixelSize
    );
  };
};