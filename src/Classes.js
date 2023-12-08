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
  constructor(id, type, name, { source, destination }) {
    this.image = new Image();
    this.image.src = './backend/assets/item_data/genus-item-resources.png';
    this.id = id;
    this.type = type;
    this.name = name;
    this.source = source;
    this.destination = destination;
    this.pixelSize = 32;
    this.scale = 2;
    this.isDragging = false;
  }

  draw = (ctx) => {
    ctx.drawImage(
      this.image,
      this.source.sx,
      this.source.sy,
      this.pixelSize,
      this.pixelSize,
      this.destination.dx,
      this.destination.dy,
      this.pixelSize * this.scale,
      this.pixelSize * this.scale
    )
  }

  // handleMouseDown = e => {
  //   const mouseX = e.clientX - canvas.getBoundingClientRect().left;
  //   const mouseY = e.clientY - canvas.getBoundingClientRect().top;

  //   if (
  //     mouseX >= this.destination.dx &&
  //     mouseX <= this.destination.dx + this.pixelSize * this.scale &&
  //     mouseY >= this.destination.dy &&
  //     mouseY <= this.destination.dy + this.pixelSize * this.scale 
  //   ) {
  //     this.isDragging = true;
  //   };
  // };

  // handleMouseMove = (e) => {
  //   if (this.isDragging) {
  //     this.destination.dx = e.clientX - canvas.getBoundingClientRect().left - this.pixelSize;
  //     this.destination.dy = e.clientY - canvas.getBoundingClientRect().top - this.pixelSize;
  //     // this.draw(ctx);
  //   };
  // };

  // handleMouseUp = () => {
  //   this.isDragging = false;
  // };
};