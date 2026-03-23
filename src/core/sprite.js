import * as PIXI from "pixi.js";

export class Sprite {
  constructor(texture = null) {
    this.view = new PIXI.Sprite();
    this.view.texture.source.scaleMode = "nearest";

    this.animations = new Map();
    this.current = null;

    this.currentFrame = 0;
    this.time = 0;

    this.scale = 1;
    this.view.scale.set(this.scale);

    this.anchor = { x: 0.5, y: 1 };
    this.view.anchor.set(0.5, 1);

    this.defaultTexture = texture;
    this.usingDefault = true;

    if (texture) {
      this.setTexture(texture);
    }
  }

  setAnchor(x, y) {
    this.anchor.x = x;
    this.anchor.y = y;
    this.view.anchor.set(x, y);
  }

  setFlip(flip) {
    this.view.scale.x = flip ? -this.scale : this.scale;
    if (flip) {
      view.x = position.x + size.x;
    } else {
      view.x = position.x;
    }
  }

  setScale(scale) {
    this.scale = scale;
    this.view.scale.set(scale);
  }

  setTexture(texture) {
    this.defaultTexture = texture;
    this.usingDefault = true;

    this.view.texture = texture;
  }

  setFrame(x, y, w, h) {
    if (!this.defaultTexture) return;

    this.usingDefault = false;

    this.view.texture = this.defaultTexture;

    this.view.texture.frame = new PIXI.Rectangle(x, y, w, h);
    this.view.texture.updateUvs();
  }

  addAnimation(name, animation) {
    this.animations.set(name, animation);
  }

  play(name) {
    if (this.current === name) return;

    const anim = this.animations.get(name);
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

    const anim = this.animations.get(this.current);
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
    const base = frame.texture;

    const rect = new PIXI.Rectangle(frame.x, frame.y, frame.w, frame.h);

    base.source.scaleMode = "nearest";

    const newTexture = new PIXI.Texture({
      source: base.source,
      frame: rect,
    });

    this.view.texture = newTexture;
  }

  getView() {
    return this.view;
  }
}

export class SpriteSheet {
  constructor(texture) {
    this.texture = texture;
  }

  generateGrid({
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
          texture: this.texture,
          x: startX + x * (frameWidth + gapX),
          y: startY + y * (frameHeight + gapY),
          w: frameWidth,
          h: frameHeight,
        });
      }
    }

    return frames;
  }
}
