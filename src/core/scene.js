import { Camera } from "./camera.js";

export class Scene {
  constructor() {
    this.entities = [];
    this.camera = new Camera();
  }

  addEntity(entity) {
    this.entities.push(entity);
  }

  removeEntity(entity) {
    this.entities = this.entities.filter((e) => e !== entity);
  }

  getEntities() {
    return this.entities;
  }

  findEntitiesByTag(tag) {
    return this.entities.filter((e) => e.tag === tag);
  }

  findEntityById(id) {
    return this.entities.find((e) => e.id === id);
  }

  getCamera() {
    return this.camera;
  }

  init() {}
  update(dt) {
    for (let entity of this.entities) {
      if (entity.active) {
        entity.update(dt);
      }
    }

    this.entities = this.entities.filter((e) => e.active);
  }
  render(renderer) {}
  destroy() {}
}
