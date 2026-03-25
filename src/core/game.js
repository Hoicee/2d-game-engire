import { Time } from "./time.js";
import { Input } from "./input.js";
import { Renderer } from "../render/renderer.js";
import { Entity } from "./entity.js";
import { Scene } from "./scene.js";
import { Sprite, SpriteResource } from "./sprite.js";

export async function startGame(canvas, options) {
  const game = new Game(canvas, options);
  await game.init();
  return game;
}
export class Game {
  constructor(canvas, options) {
    this.canvas = canvas;

    this.renderer = new Renderer(canvas, options);
    this.time = new Time();
    this.input = new Input(canvas);

    this.scenes = [];

    this.spriteResourceMap = new Map();

    this.gravity = 980;

    this.running = false;
  }

  async init() {
    this.renderer.init();
  }

  pushScene(scene) {
    this.scenes.push(scene);

    scene.init();

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

  createScene() {
    return new Scene(this.renderer);
  }

  createEntity(...componentList) {
    return new Entity(this, componentList);
  }

  vec2(x, y) {
    return new Vec2(x, y);
  }

  async loadSprite(tag, route) {
    const spriteResource = await SpriteResource.load(this.renderer, route);
    this.spriteResourceMap.set(tag, spriteResource);
    return spriteResource;
  }

  createSprite(resource_tag) {
    if (!this.spriteResourceMap.has(resource_tag))
      throw new Error("No resource found");
    return new Sprite(this.spriteResourceMap.get(resource_tag), this.renderer);
  }

  async loadTexture(route) {
    const texture = await this.renderer.loadTexture(route);
    return texture;
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

  //COMPONENT CREATION FUNCTIONS...

  // FOR ENTITY:
  pos(x, y) {
    return (entity) => {
      entity.setPosition(x, y);
    };
  }

  size(w, h) {
    return (entity) => {
      entity.setSize(w, h);
    };
  }

  color(color) {
    return (entity) => {
      entity.color = color;
    };
  }

  solid() {
    return (entity) => {
      entity.isStatic = true;
      entity.hasCollision = true;
    };
  }

  physics() {
    return (entity) => {
      entity.isStatic = false;
      entity.useGravity = true;
      entity.hasCollision = true;
      entity.friction = 0.98;
    };
  }

  rect() {
    return (entity) => {
      entity.makeRect();
    };
  }

  tags(...tagList) {
    return (entity) => {
      for (const tag of tagList) {
        entity.addTag(tag);
      }
    };
  }

  debug(debug) {
    return (entity) => {
      entity.debug = debug;
    };
  }
}
