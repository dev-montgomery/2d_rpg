export class Player {
  constructor({ source, destination }) {
    this.image = new Image();
    this.image.src = './backend/assets/player_data/player-64.png';
    this.source = source;
    this.destination = destination;
    this.direction = { sx: 0, sy: 0 };
    this.size = 64;
    this.offset = 16;
    this.speed = 500;
    this.cooldown = false;
  };
  
  draw = (ctx) => {
    ctx.drawImage(
      this.image,
      this.direction.sx,
      this.direction.sy,
      this.size,
      this.size,
      this.destination.dx,
      this.destination.dy,
      this.size,
      this.size
    );
  };
};

export class Tile {
  constructor({ source, destination }) {
    this.source = source;
    this.destination = destination;
    this.size = 64;
  };
};

export class Item {
  constructor(id, type, name, sx, sy, dx, dy, scale) {
    this.image = new Image();
    this.image.src = './backend/assets/item_data/genus-items-64.png';
    this.id = id;
    this.type = type;
    this.name = name;
    this.sx = sx;
    this.sy = sy;
    this.dx = dx;
    this.dy = dy;
    this.scale = scale;
    this.size = 64;
    this.isDragging = false;
  }

  draw = (ctx) => {  
    ctx.drawImage(
      this.image,
      this.sx,
      this.sy,
      this.size,
      this.size,
      this.dx,
      this.dy,
      this.size * this.scale,
      this.size * this.scale
    );
  };
};