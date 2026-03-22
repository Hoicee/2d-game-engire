import { Time } from "./time.js";
import { Input } from "./input.js";
import { createRenderer } from "../render/renderer.js";

export class Game {
  constructor(canvas) {
    this.canvas = canvas;

    this.renderer = createRenderer(canvas);
    this.time = new Time();
    this.input = new Input(canvas);

    this.scenes = [];

    this.running = false;
  }

  async init() {
    this.renderer = await createRenderer(this.canvas);
  }

  pushScene(scene) {
    this.scenes.push(scene);

    if (scene.init) scene.init();

    scene.updateEnabled ??= true;
    scene.renderEnabled ??= true;

    this.renderer.setCamera(scene.getCamera());
  }

  popScene() {
    const scene = this.scenes.pop();

    if (scene && scene.destroy) {
      scene.destroy();
    }

    const current = this.getScene();
    if (current) {
      this.renderer.setCamera(current.getCamera());
    }
  }

  getScene() {
    return this.scenes[this.scenes.length - 1];
  }

  start() {
    this.running = true;
    requestAnimationFrame(this.loop.bind(this));
  }

  stop() {
    this.running = false;
  }

  loop(time) {
    if (!this.running) return;

    this.time.update(time);

    const dt = this.time.delta;

    const scene = this.getScene();
    if (scene && scene.updateEnabled) {
      scene.update(dt);
    }

    if (scene && scene.renderEnabled) {
      scene.render();
    }

    this.renderer.render(time);

    this.input.update();
    requestAnimationFrame(this.loop.bind(this));
  }

  update(dt) {
    const scene = this.getScene();

    if (!scene) return;

    if (scene.updateEnabled) {
      scene.update(dt);
    }
  }

  render() {
    const scene = this.getScene();
    if (!scene) return;

    if (scene.renderEnabled) {
      scene.render(this.renderer);
    }

    this.renderer.render();
  }

  getInput() {
    return this.input;
  }

  getRenderer() {
    return this.renderer;
  }

  getTime() {
    return this.time;
  }
}
