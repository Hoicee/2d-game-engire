import * as PIXI from "pixi.js";

export async function createRenderer(canvas) {
  const app = new PIXI.Application();

  await app.init({
    canvas: canvas,
    resizeTo: window,
    autoDensity: false,
    backgroundColor: "#000000",
  });

  app.ticker.autoStart = false;
  app.ticker.stop();

  return {
    app,
    stage: app.stage,
    camera: null,

    setCamera(camera) {
      this.camera = camera;
    },

    clear() {
      // Pixi handles clearing automatically
    },

    createRect(width, height, color = 0xffffff) {
      const graphics = new PIXI.Graphics()
        .rect(0, 0, width, height)
        .fill(color);

      return graphics;
    },

    addToStage(displayObject) {
      this.stage.addChild(displayObject);
    },

    removeFromStage(displayObject) {
      this.stage.removeChild(displayObject);
    },

    updateTransform(displayObject, position) {
      if (!this.camera) {
        displayObject.x = position.x;
        displayObject.y = position.y;
        return;
      }

      displayObject.x = position.x - this.camera.position.x;
      displayObject.y = position.y - this.camera.position.y;
    },

    render(time) {
      this.app.ticker.update(time);
    },
  };
}
