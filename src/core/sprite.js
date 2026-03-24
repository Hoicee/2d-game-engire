import * as PIXI from "pixi.js";
import { Animation } from "./animation";
import { Vec2 } from "../math/vec2";

export class SpriteResource {
  constructor(texture, renderer) {
    this.texture = texture;
    this.renderer = renderer;
    this.animations = new Map();
  }

  static async load(renderer, url) {
    const texture = await renderer.loadTexture(url);
    return new SpriteResource(texture, renderer);
  }

  generateFrames({
    startX = 0,
    startY = 0,
    frameWidth,
    frameHeight,
    gapX = 0,
    gapY = 0,
    columns,
    rows,
  }) {
    const frames = [];

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        frames.push({
          x: startX + x * (frameWidth + gapX),
          y: startY + y * (frameHeight + gapY),
          w: frameWidth,
          h: frameHeight,
        });
      }
    }

    for (const frame of frames) {
      frame.texture = this.renderer.cropTexture(
        this.texture,
        frame.x,
        frame.y,
        frame.w,
        frame.h,
      );
    }

    return frames;
  }

  addAnimation(name, frames, speed = 10) {
    this.animations.set(
      name,
      new Animation(this.generateFrames(frames), { speed }),
    );
  }

  getAnimation(name) {
    return this.animations.get(name);
  }
}

export class Sprite {
  constructor(resource, renderer) {
    this.resource = resource;

    this.texture = resource.texture;
    this.defaultTexture = this.texture;
    this.usingDefault = true;

    this.view = renderer.createSpriteView();
    this.view.texture = this.texture;

    this.current = null;

    this.currentFrame = 0;
    this.time = 0;

    this.scale = 1;
    this.view.scale.set(this.scale);

    this.setAnchor(0.5, 1);
  }

  setAnchor(x, y) {
    this.anchor = new Vec2(x, y);
    this.view.anchor.set(x, y);
  }

  setFlip(flip) {
    this.view.scale.x = flip ? -this.scale : this.scale;
  }

  setScale(scale) {
    this.scale = scale;
    this.view.scale.set(scale);
  }

  setFrame(x, y, w, h) {
    if (!this.defaultTexture) return;

    this.usingDefault = false;

    this.view.texture = this.defaultTexture;

    this.view.texture.frame = new PIXI.Rectangle(x, y, w, h);
    this.view.texture.updateUvs();
  }

  play(name) {
    if (this.current === name) return;

    const anim = this.resource.animations.get(name);
    if (!anim) return;

    this.current = name;
    this.currentFrame = 0;
    this.time = 0;

    this.usingDefault = false;

    this.applyFrame(anim.frames[0]);
  }

  stop() {
    this.current = null;
    this.usingDefault = true;

    if (this.defaultTexture) {
      this.view.texture = this.defaultTexture;
    }
  }

  update(dt) {
    if (!this.current) return;

    const anim = this.resource.animations.get(this.current);
    if (!anim) return;

    this.time += dt;

    const frameDuration = 1 / anim.speed;

    while (this.time >= frameDuration) {
      this.time -= frameDuration;
      this.currentFrame++;

      if (this.currentFrame >= anim.frames.length) {
        if (anim.loop) {
          this.currentFrame = 0;
        } else {
          this.currentFrame = anim.frames.length - 1;
        }
      }

      this.applyFrame(anim.frames[this.currentFrame]);
    }
  }

  applyFrame(frame) {
    this.view.texture = frame.texture;
  }

  getView() {
    return this.view;
  }
}
