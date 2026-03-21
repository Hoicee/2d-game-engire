import { Vec2 } from "../math/vec2.js";

export class Camera {
  constructor() {
    this.position = new Vec2();
    this.zoom = 1;

    this.target = null;
  }

  follow(entity) {
    this.target = entity;
  }

  update() {
    if (this.target) {
      this.position.copy(this.target.position);
    }
  }

  worldToScreen(pos) {
    return pos.clone().sub(this.position).scale(this.zoom);
  }

  screenToWorld(pos) {
    return pos
      .clone()
      .scale(1 / this.zoom)
      .add(this.position);
  }
}
