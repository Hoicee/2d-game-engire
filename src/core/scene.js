import { Camera } from "./camera.js";
import { aabbCollision, resolveCollision } from "../math/collision.js";

export class Scene {
  constructor(renderer) {
    this.renderer = renderer;
    this.entities = [];
    this.camera = new Camera();

    this.updateEnabled = true;
    this.renderEnabled = true;
  }

  addEntity(entity) {
    this.entities.push(entity);
    entity.createView(this.renderer);
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
      entity.update(dt, this.renderer);
    }

    for (let entity of this.entities) {
      if (!entity.hasCollision || entity.isStatic) continue;

      for (let other of this.entities) {
        if (entity === other) continue;
        if (!other.hasCollision) continue;

        if (aabbCollision(entity, other)) {
          resolveCollision(entity, other);
        }
      }
    }

    this.camera.update();

    this.entities = this.entities.filter((e) => e.active);
  }

  render() {
    for (let entity of this.entities) {
      entity.render(this.renderer);
    }
  }
  destroy() {}
}
