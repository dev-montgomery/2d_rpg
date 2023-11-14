export class Sprite {
  constructor() {
      this.image = new Image();
      this.image.src = './backend/assets/spritesheet-npcs.png';
      // this.sPosition = {
      //   sx,
      //   sy
      // };
      // this.dPosition = {
      //   dx,
      //   dy
      // };
      this.pixelSize = 32;
    };
    
    draw = () => {
      ctx.drawImage(
        this.image,
        this.sPosition.x,
        this.sPosition.y,
        this.pixelSize,
        this.dPosition.x,
        this.dPosition.y,
        this.pixelSize
      );
    };
};