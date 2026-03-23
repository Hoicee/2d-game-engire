export class Animation {
  constructor(frames = [], options = {}) {
    this.frames = frames;

    this.speed = options.speed || 10;
    this.loop = options.loop ?? true;
  }
}
