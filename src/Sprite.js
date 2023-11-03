export class Sprite {
  constructor({
    sprite,  // image of sprite
    sx, // x location on spritesheet
    sy, // y location on spritesheet
    sWidth, // original width
    sHeight, // original height
    dx, 
    dy,
    dWidth,
    dHeight,
    frame, // the current frame
  }) {
    this.sprite = sprite;
    this.sx = sx ?? 0;
    this.sy = sy ?? 0;
    this.dx = dx ?? 0;
    this.dy = dy ?? 0;
    this.dWidth = dWidth ?? 32;
    this.dHeight = dHeight ?? 32;
    this.sWidth = sWidth ?? 32;
    this.sHeight = sHeight ?? 32;
    this.frame = frame ?? 0;
  }

  drawImage(ctx, x, y) {
    if (!this.resource.isLoaded) {
      return;
    }

    // locate the exact frame to use
    ctx.drawImage(
      this.sprite, 
      0, 
      0,
      32,
      32
    )
  }
};