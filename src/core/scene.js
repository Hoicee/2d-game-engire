import { Camera } from "./camera.js";
import { aabbCollision } from "../math/collision.js";

export class Scene {
  constructor(game) {
    this.game = game;
    this.entities = [];
    this.camera = new Camera();

    this.updateEnabled = true;
    this.renderEnabled = true;
  }

  addEntity(entity) {
    this.entities.push(entity);

    entity.createView(this.game.renderer);
  }

  removeEntity(entity) {
    this.entities = this.entities.filter((e) => e !== entity);
  }

  getEntities() {
    return this.entities;
  }

  findEntitiesByTag(tag) {
    return this.entities.filter((e) => e.tags.has(tag));
  }

  findEntityById(id) {
    return this.entities.find((e) => e.id === id);
  }

  getCamera() {
    return this.camera;
  }

  init() {}
  onUpdate(dt) {}

  update(dt) {
    this.onUpdate(dt);

    for (let entity of this.entities) {
      entity.update(dt);
    }

    this.camera.update();

    for (let entity of this.entities) {
      if (!entity.hasCollision || entity.isStatic) continue;

      for (let other of this.entities) {
        if (entity === other) continue;
        if (!other.hasCollision) continue;

        if (aabbCollision(entity, other)) {
          this.resolveCollision(entity, other);
        }
      }
    }

    this.entities = this.entities.filter((e) => e.active);
  }

  resolveCollision(a, b) {
    const dx = a.position.x + a.size.x / 2 - (b.position.x + b.size.x / 2);
    const dy = a.position.y + a.size.y / 2 - (b.position.y + b.size.y / 2);

    const combinedHalfWidths = (a.size.x + b.size.x) / 2;
    const combinedHalfHeights = (a.size.y + b.size.y) / 2;

    const overlapX = combinedHalfWidths - Math.abs(dx);
    const overlapY = combinedHalfHeights - Math.abs(dy);

    if (overlapX < overlapY) {
      if (dx > 0) {
        a.position.x += overlapX;
      } else {
        a.position.x -= overlapX;
      }
      a.velocity.x = 0;
    } else {
      if (dy > 0) {
        a.position.y += overlapY;
      } else {
        a.position.y -= overlapY;

        a.velocity.y = 0;
        a.isGrounded = true;
      }
    }
  }

  render() {
    for (let entity of this.entities) {
      entity.render(this.game.getRenderer());
    }
  }
  destroy() {}
}
