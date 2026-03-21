import { Vec2 } from "../math/vec2.js";

let ENTITY_ID = 0;

export class Entity {
  constructor() {
    this.id = ENTITY_ID++;

    this.position = new Vec2();
    this.velocity = new Vec2();
    this.acceleration = new Vec2();

    this.useGravity = false;

    this.collider = null;

    this.active = true;
    this.tag = null;
  }

  update(dt) {
    if (!this.active) return;

    if (this.useGravity) {
      this.acceleration.y += 980;
    }

    this.velocity.add(this.acceleration.clone().scale(dt));
    this.position.add(this.velocity.clone().scale(dt));

    this.acceleration.set(0, 0);
  }

  destroy() {
    this.active = false;
  }
}
