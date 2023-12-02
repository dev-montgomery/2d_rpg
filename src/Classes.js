export class Sprite {
  constructor({ source, destination }) {
    this.image = new Image();
    this.image.src = './backend/assets/player_data/player-64.png';
    this.source = source;
    this.destination = destination;
    this.direction = { sx: 0, sy: 0 };
    this.mapLocation = { mx: 93, my: 143 };
    this.pixelSize = 64;
    this.offset = 16;
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

export class Tile {
  constructor({ position }) {
    this.position = position;
    this.pixelSize = 32;
  };
};