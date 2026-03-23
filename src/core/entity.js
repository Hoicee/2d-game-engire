import { Vec2 } from "../math/vec2.js";

let ENTITY_ID = 0;

export class Entity {
  constructor(options = { size: new Vec2(0, 0) }) {
    this.id = ENTITY_ID++;

    this.position = new Vec2();
    this.velocity = new Vec2();
    this.acceleration = new Vec2();

    this.useGravity = false;

    this.view = null;
    this.size = options.size;

    this.active = true;
    this.tags = new Set();

    this.origin = { x: 0, y: 0 };

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

  addSprite(sprite, renderer) {
    this.sprite = sprite;
    if (!this.sprite) return;

    this.view = this.sprite.getView();
    renderer.addToStage(this.view);
    if (this.size.x === 0 && this.size.y === 0) {
      const tex = this.sprite.getView().texture;

      this.size.set(
        tex.width * this.sprite.scale,
        tex.height * this.sprite.scale,
      );
    }

    this.origin.x = this.sprite.anchor.x;
    this.origin.y = this.sprite.anchor.y;
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

  createView(renderer) {
    if (this.view) return;

    this.view = renderer.createRect(this.size.x, this.size.y, this.color);

    if (this.debug) {
      this.debugGraphics = renderer.createDebugRect();
    }

    renderer.addToStage(this.view);
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

  render(renderer) {
    if (!this.view) return;

    this.view.visible = this.visible;

    renderer.updateTransform(this.view, this.position);

    if (this.debug && this.debugGraphics) {
      const left = this.position.x - this.size.x * this.origin.x;
      const top = this.position.y - this.size.y * this.origin.y;

      const updated = renderer.updateTransform(
        { x: left, y: top },
        { x: left, y: top },
      );

      renderer.drawRect(
        this.debugGraphics,
        updated.x,
        updated.y,
        this.size.x,
        this.size.y,
      );

      renderer.drawPoint(this.debugGraphics, updated.x, updated.y);
    }
  }

  destroy() {
    this.active = false;
  }
}
