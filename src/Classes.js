export class Player {
  constructor({ source, destination }) {
    this.image = new Image();
    this.image.src = './backend/assets/player_data/player-64.png';
    this.source = source;
    this.destination = destination;
    this.direction = { sx: 0, sy: 0 };
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
  constructor({ source, destination }) {
    this.source = source;
    this.destination = destination;
    this.pixelSize = 64;
  };
};

export class Item {
  constructor(id, type, name, sx, sy, dx, dy) {
    this.image = new Image();
    this.image.src = './backend/assets/item_data/genus-items-64.png';
    this.id = id;
    this.type = type;
    this.name = name;
    this.sx = sx;
    this.sy = sy;
    this.dx = dx;
    this.dy = dy;
    this.pixelSize = 64;
    this.scale = 1;
    this.isDragging = false;
  }

  draw = (ctx) => {  
    ctx.drawImage(
      this.image,
      this.sx,
      this.sy,
      this.pixelSize,
      this.pixelSize,
      this.dx,
      this.dy,
      this.pixelSize * this.scale,
      this.pixelSize * this.scale
    );
  };
};