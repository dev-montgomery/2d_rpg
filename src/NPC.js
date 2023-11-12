export class NPC {
  constructor(
    sprite,  // image of sprite
    sx, // x location on spritesheet
    sy, // y location on spritesheet
    sWidth, // original width
    sHeight, // original height
    x, // Initial x coord
    y // Initial y coord
  ) {
    this.sprite = new Image();
    this.sprite.src = '../assets/spritesheet-npcs.png';
    this.sx = sx ?? 0;
    this.sy = sy ?? 0;
    this.sWidth = sWidth ?? 32;
    this.sHeight = sHeight ?? 32;
    this.x = x ?? 0;
    this.y = y ?? 0;
    this.dx = x ?? 0;
    this.dy = y ?? 0;
    this.speed = 2;
    this.moveInterval = 5000;
    this.lastMoveTime = 0;
  }

  // Draw and update NPC
  updateNPC = (canvas, currentTime) => {
    if (currentTime - this.lastMoveTime > this.moveInterval) {
      this.lastMoveTime = currentTime;
      // New target coordinates
      this.dx = Math.random() * (canvas.width - this.sWidth);
      this.dy = Math.random() * (canvas.height - this.sHeight);
    }

    // Move to new coords
    if (this.x < this.dx) {
      this.x += this.speed;
    } else if (this.x > this.dx) {
      this.x -= this.speed;
    }

    if (this.y < this.dy) {
      this.y += this.speed;
    } else if (this.y > this.dy) {
      this.y -= this.speed;
    }
  }

  draw = ctx => {
    ctx.drawImage(
      this.sprite, 
      this.sx, 
      this.sy,
      this.sWidth,
      this.sHeight,
      this.dx,
      this.dy,
      this.dWidth,
      this.dHeight
    )
  }
};