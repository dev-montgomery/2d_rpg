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
    this.dx = 704; // Draw starting location x
    this.dy = 608; // Draw starting location y
    this.move = {
      x: 0,
      y: 0
    };
    this.currentFrame = this.sprite.direction.forward;
  };

  draw = (ctx) => {
    this.isLoaded && ctx.drawImage(
      this.sprite,
      this.currentFrame.x,
      this.currentFrame.y,
      this.pixelSize,
      this.pixelSize,
      this.dx,
      this.dy,
      this.pixelSize,
      this.pixelSize
    );
  };

  update = (ctx) => {
    this.dx += this.move.x;
    this.dy += this.move.y;  
    this.draw(ctx);
  };
};