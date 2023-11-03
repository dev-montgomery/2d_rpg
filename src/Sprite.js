export class Sprite {
  constructor({
    resource,  // the image to use
    frameSize, // size of the crop of the image 32 32
    xFrames,   // the width of the sprite to be used
    yFrames,   // the height of the sprite to be used
    frame,     // the current frame
    scale,     // how large do we want it to be
    position,  // where to start drawing
  }) {
    this.resource = resource;
    this.frameSize = frameSize ?? new Vector2(32,32);
    this.xFrames = xFrames ?? 1;
    this.yFrames = yFrames ?? 1;
    this.frame = frame ?? 0;
    this.scale = scale ?? 1;
    this.position = position ?? new Vector2(0,0);
    this.frameMap = new Map();
    this.buildFrameMap();
  };

  buildFrameMap() {
    // let frameCount = 0;  iterate through frames
    for (let v = 0 ; v < this.yFrames ; v++) {
      for (let h = 0 ; h < this.xFrames ; h++) {
        this.frameMap.set(
          new Vector2(this.frameSize.x * h, this.frameSize.y * v)
        )
      }
    }
  }

  drawImage(ctx, x, y) {
    if (!this.resource.isLoaded) {
      return;
    }

    // locate the exact fram to use
    let frameCoordX = this.frameSize.x;
    let frameCoordY = this.frameSize.y;
    const frame = this.frameMap.get(this.frame)
    
    if (frame) {
      frameCoordX = frame.x;
      frameCoordY = frame.y;
    }

    const frameSizeX = this.frameSize.x;
    const frameSizeY = this.frameSize.y;

    ctx.drawImage(
      this.resource.image,
      frameCoordX, // top corner x
      frameCoordY, // top corner y
      frameSizeX,
      frameSizeY,
      x,
      y,
      frameSizeX * this.scale,
      frameSizeY * this.scale
    )
  }
};

export class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  };
};