export class Sprite {
  constructor({ source, destination }) {
    this.image = new Image();
    this.image.src = './backend/assets/player_data/spritesheet-npcs.png';
    this.source = source;
    this.destination = destination;
    this.direction = { sx: 0, sy: 0 };
    this.mapLocation = { mx: 97, my: 66 };
    this.moveable = true;
    this.pixelSize = 32;
    this.offset = 8;
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

export class Boundary {
  constructor({ position }) {
    this.position = position;
    this.pixelSize = 32;
  };
};