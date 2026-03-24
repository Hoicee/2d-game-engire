import { Vec2 } from "../math/vec2.js";

let ENTITY_ID = 0;

export class Entity {
  constructor(game, options = { size: new Vec2(0, 0) }) {
    this.id = ENTITY_ID++;

    this.game = game;
    this.renderer = game.renderer;

    this.position = new Vec2();
    this.velocity = new Vec2();
    this.acceleration = new Vec2();

    this.useGravity = false;

    this.defaultTexture = null;
    this.view = null;
    this.size = options.size;

    this.active = true;
    this.tags = new Set();

    this.origin = new Vec2(0, 0);

    this.hasCollision = false;
    this.isStatic = false;
    this.visible = true;

    this.friction = 1;
    this.maxVelocity = 3000;

    this._inputAcceleration = new Vec2();

    this.sprite = null;

    this.debug = false;
    this.debugGraphics = null;
  }

  setSprite(resource_tag, cut_options) {
    this.sprite = this.game.createSprite(resource_tag);
    if (!this.sprite) return;

    this.view = this.sprite.getView();

    if (cut_options) {
      this.view.texture = this.renderer.cropTexture(
        this.view.texture,
        cut_options.x,
        cut_options.y,
        cut_options.w,
        cut_options.h,
      );
    }

    this.game.renderer.addToStage(this.view);
    if (this.size.x === 0 && this.size.y === 0) {
      const tex = this.sprite.getView().texture;

      this.size.set(
        tex.width * this.sprite.scale,
        tex.height * this.sprite.scale,
      );
    }

    this.setAnchor(this.sprite.anchor.x, this.sprite.anchor.y);

    return this.sprite;
  }

  setFlip(flip) {
    if (!this.sprite) return;
    this.sprite.setFlip(flip);
  }

  play(tag) {
    if (!this.sprite) return;
    this.sprite.play(tag);
  }

  stop(tag) {
    if (!this.sprite) return;
    this.sprite.stop(tag);
  }

  addTag(tag) {
    this.tags.add(tag);
  }

  removeTag(tag) {
    this.tags.delete(tag);
  }

  hasTag(tag) {
    return this.tags.has(tag);
  }

  setAcceleration(x, y) {
    this._inputAcceleration.set(x, y);
  }

  setVelocity(x, y) {
    this.velocity.set(x, y);
  }

  setFriction(value) {
    this.friction = value;
  }

  setMaxVelocity(value) {
    this.maxVelocity = Math.min(value, 3000);
  }

  setAnchor(x = 0.5, y = 1) {
    if (!this.origin.hasDiff(new Vec2(x, y))) return;

    x = Math.max(0, Math.min(x, 1));
    y = Math.max(0, Math.min(y, 1));

    this.origin.set(x, y);

    if (this.sprite) {
      this.sprite.setAnchor(x, y);
    } else if (this.view) {
      this.view.anchor.x = x;
      this.view.anchor.y = y;
    }
  }

  createView() {
    this.makeRect();

    if (this.debug) {
      this.debugGraphics = this.renderer.createDebugRect();
    }

    this.renderer.addToStage(this.view);
  }

  makeRect() {
    if (this.view) return;
    this.view = this.renderer.createRect(this.size.x, this.size.y, this.color);
  }

  update(dt) {
    if (!this.active) return;

    this.acceleration.set(0, 0);
    this.acceleration.add(this._inputAcceleration);

    if (this.useGravity) {
      this.acceleration.y += 980;
    }

    this.velocity.add(this.acceleration.clone().scale(dt));

    this.velocity.x *= this.friction;

    if (Math.abs(this.velocity.x) < 0.0001) this.velocity.x = 0;
    if (Math.abs(this.velocity.y) < 0.0001) this.velocity.y = 0;

    this.velocity.x = Math.max(
      -this.maxVelocity,
      Math.min(this.maxVelocity, this.velocity.x),
    );

    this.velocity.y = Math.max(
      -this.maxVelocity,
      Math.min(this.maxVelocity, this.velocity.y),
    );

    this.position.add(this.velocity.clone().scale(dt));

    this._inputAcceleration.set(0, 0);

    if (this.sprite) {
      const tex = this.sprite.getView().texture;

      this.size.set(
        tex.width * this.sprite.scale,
        tex.height * this.sprite.scale,
      );

      this.sprite.update(dt);
    }

    this.isGrounded = false;
  }

  render() {
    if (!this.view) return;

    this.view.visible = this.visible;

    this.renderer.updateTransform(this.view, this.position);

    if (this.debug && this.debugGraphics) {
      const left = this.position.x - this.size.x * this.origin.x;
      const top = this.position.y - this.size.y * this.origin.y;

      const updated = this.renderer.updateTransform(
        { x: left, y: top },
        { x: left, y: top },
      );

      this.renderer.drawRect(
        this.debugGraphics,
        updated.x,
        updated.y,
        this.size.x,
        this.size.y,
      );

      this.renderer.drawPoint(this.debugGraphics, updated.x, updated.y);
    }
  }

  destroy() {
    this.active = false;
  }
}
