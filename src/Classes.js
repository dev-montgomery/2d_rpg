export class Sprite {
  constructor({
    image,
    sprite,
    drawTo
    }) {
    this.image = new Image();
    this.image.src = '../assets/spritesheet-npcs.png';
    this.sprite = {
      forward: { sx, sy },
      backward: { sx, sy },
      right: { sx, sy },
      left: { sx, sy }
    };
    this.drawTo = {
      dx,
      dy
    };
    this.pixels = 32;

    this.image.onload = () => {
      ctx.drawImage(
        this.image,
        this.sprite.forward.x,
        this.sprite.forward.y,
        this.pixels,
        this.drawto.x,
        this.drawto.y,
        this.pixels
      )
    }
  };
};