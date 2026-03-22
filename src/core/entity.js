import { Vec2 } from "../math/vec2.js";

let ENTITY_ID = 0;

export class Entity {
  constructor() {
    this.id = ENTITY_ID++;

    this.position = new Vec2();
    this.velocity = new Vec2();
    this.acceleration = new Vec2();

    this.useGravity = false;

    this.view = null;
    this.size = new Vec2(50, 50);
    this.color = "red";

    this.active = true;
    this.tags = new Set();

    this.hasCollision = false;
    this.isStatic = false;
    this.visible = true;

    this.friction = 1;
    this.maxVelocity = 3000;

    this._inputAcceleration = new Vec2();
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

    this.isGrounded = false;
  }

  render(renderer) {
    if (!this.view) return;

    this.view.visible = this.visible;
    renderer.updateTransform(this.view, this.position);
  }

  destroy() {
    this.active = false;
  }
}
