export class Sprite {
  constructor({origin, destination}) {
    this.image = new Image();
    this.image.src = './backend/assets/player_data/spritesheet-npcs.png';
    this.origin = origin;
    this.destination = destination;
    this.direction = { sx: 0, sy: 0 };
    this.pixelSize = 32;
    this.position = { x: 97, y: 66 };
    this.speed = 500;
    this.cooldown = false;
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
      this.pixelSize,
      this.pixelSize
    );
  };
};