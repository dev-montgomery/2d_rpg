export class Sprite {
  constructor({origin, destination}) {
      this.image = new Image();
      this.image.src = './backend/assets/spritesheet-npcs.png';
      this.origin = origin;
      this.destination = destination;
      this.pixelSize = 32;
      this.direction = { sx: 0, sy: 0 };
    };
    
    draw = (ctx) => {
      ctx.drawImage(
        this.image,
        this.direction.sx,
        this.direction.sy,
        this.pixelSize,
        this.pixelSize,
        this.destination.dx,
        this.destination.dy,
        this.pixelSize * 2,
        this.pixelSize * 2
      );
    };
};