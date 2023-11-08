export class Player {
  constructor(
    sprite,
    sx,
    sy,
    sWidth,
    sHeight,
    dx,
    dy,
    lastX,
    lastY
  ) {
    this.sprite = new Image();
    this.sprite.src = './assets/spritesheet-npcs.png';
    this.sprite.onload = () => {
      this.isLoaded = true;
    };
    this.sx = sx ?? 0;
    this.sy = sy ?? 0;
    this.sWidth = sWidth ?? 32;
    this.sHeight = sHeight ?? 32;
    this.dx = dx ?? 704; // Draw starting location x
    this.dy = dy ?? 608; // Draw starting location y
    this.lastX = lastX;
    this.lastY = lastY;
  };

  init = (ctx, sx, sy, sWidth, sHeight) => {
    this.isLoaded && ctx.drawImage(
      this.sprite,
      this.sx,
      this.sy,
      this.sWidth,
      this.sHeight,
      this.dx,
      this.dy,
      this.sWidth,
      this.sHeight
    );
  };
};