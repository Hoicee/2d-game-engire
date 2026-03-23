import { Camera } from "./camera.js";
import { aabbCollision } from "../math/collision.js";
import { getBounds } from "../math/collision.js";

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

    if (this.debug) {
      this.debugGraphics = this.game.renderer.createDebugRect();
    }

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
      entity.update(dt, this.game.renderer);
    }

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

    this.camera.update();

    this.entities = this.entities.filter((e) => e.active);
  }

  resolveCollision(a, b) {
    const A = getBounds(a);
    const B = getBounds(b);

    const overlapX = Math.min(A.right - B.left, B.right - A.left);
    const overlapY = Math.min(A.bottom - B.top, B.bottom - A.top);

    if (overlapX <= 0 || overlapY <= 0) return;

    if (overlapX < overlapY) {
      if (a.velocity.x > 0) {
        a.position.x -= overlapX;
      } else if (a.velocity.x < 0) {
        a.position.x += overlapX;
      }

      a.velocity.x = 0;
    } else {
      if (a.velocity.y > 0) {
        a.position.y -= overlapY;
        a.velocity.y = 0;
        a.isGrounded = true;
      } else if (a.velocity.y < 0) {
        a.position.y += overlapY;
        a.velocity.y = 0;
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
