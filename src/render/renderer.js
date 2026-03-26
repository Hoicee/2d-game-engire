import * as PIXI from "pixi.js";
export class Renderer {
  constructor(canvas, options) {
    this.app = new PIXI.Application();
    this.stage = this.app.stage;
    this.canvas = canvas;
    this.camera = null;
    this.w = options?.w;
    this.h = options?.h;
    this.resizeTo = options?.resizeTo;
  }

  async init() {
    await this.app.init({
      canvas: this.canvas,
      resizeTo: this.resizeTo,
      width: this.w,
      height: this.h,
      autoDensity: false,
      backgroundColor: "#000000",
      antialias: true,
      resolution: window.devicePixelRatio,
    });

    this.app.ticker.autoStart = false;
    this.app.ticker.stop();
  }

  async loadTexture(route) {
    const texture = await PIXI.Assets.load(route);
    return texture;
  }

  setCamera(camera) {
    this.camera = camera;
  }

  clear() {
    // Pixi handles clearing automatically
  }

  createSpriteView() {
    const view = new PIXI.Sprite();
    view.texture.source.scaleMode = "nearest";

    return view;
  }

  createRect(width, height, color = 0xffffff) {
    const graphics = new PIXI.Graphics().rect(0, 0, width, height).fill(color);

    return graphics;
  }

  createText(text, x, y, options = {}) {
    const {
      fontFamily = "Arial",
      fontSize = 16,
      color = 0xffffff,
      align = "left",
    } = options;

    const t = new PIXI.Text({
      text,
      style: {
        fontFamily,
        fontSize,
        fill: color,
        align,
      },
    });

    t.x = Math.round(x);
    t.y = Math.round(y);

    return t;
  }

  cropTexture(texture, x = 0, y = 0, w = 0, h = 0) {
    const rect = new PIXI.Rectangle(x, y, w, h);
    texture.source.scaleMode = "nearest";

    return new PIXI.Texture({
      source: texture.source,
      frame: rect,
    });
  }

  addToStage(displayObject) {
    if (!displayObject) return;
    this.stage.addChild(displayObject);
  }

  removeFromStage(displayObject) {
    if (!displayObject) return;
    this.stage.removeChild(displayObject);
  }

  updateTransform(displayObject, position, fixed = false) {
    if (!this.camera || fixed) {
      displayObject.x = position.x;
      displayObject.y = position.y;
      return;
    }

    displayObject.x = position.x - this.camera.position.x;
    displayObject.y = position.y - this.camera.position.y;

    return displayObject;
  }

  render(time) {
    if (this.camera) {
      if (this.camera.zoom != this.stage.scale.y) {
        this.stage.scale.set(this.camera.zoom, this.camera.zoom);
      }
    }
    this.app.ticker.update(time);
  }

  getScreenSize() {
    return { width: this.app.screen.width, height: this.app.screen.height };
  }

  createDebugRect() {
    const g = new PIXI.Graphics();
    g.fill(0xffffff);
    this.stage.addChild(g);
    return g;
  }

  drawRect(graphics, x, y, w, h) {
    graphics.clear();
    graphics.rect(x, y, w, h);
    graphics.stroke({ width: 1, color: 0xff0000 });
    graphics.fill(0xffffff);
  }

  drawPoint(graphics, x, y) {
    graphics.rect(x - 2, y - 2, 4, 4);
    graphics.fill({ color: 0x00ff00 });
  }
}
