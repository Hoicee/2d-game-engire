import { Camera } from "./camera.js";
import { aabbCollision, resolveCollision } from "../math/collision.js";
import { clamp } from "../math/helpers.js";

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
  }

  addEntityList(...entityList) {
    for (const entity of entityList) {
      this.addEntity(entity);
    }
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

  setCameraFollow(entity) {
    this.camera.follow(entity);
  }

  removeCameraFollow() {
    this.camera.removeFollow();
  }

  setCameraSmoothness(smoothness) {
    smoothness = clamp(smoothness, 0.1, 1);

    this.camera.smoothness = smoothness;
  }

  init() {
    for (const entity of this.entities) {
      this.renderer.addToStage(entity.view);
    }
  }

  disableUpdate() {
    this.updateEnabled = false;
  }

  disableRender() {
    for (const entity of this.entities) {
      this.renderer.removeFromStage(entity.view);
    }
    this.updateEnabled = false;
    this.renderEnabled = false;
  }

  destroy() {}

  onUpdate(dt) {}

  update(dt) {
    this.onUpdate(dt);

    for (let entity of this.entities) {
      entity.update(dt, this.renderer);
    }

    this.handleCollisions();

    this.camera.update();

    this.entities = this.entities.filter((e) => e.active);
  }

  handleCollisions() {
    for (let entity of this.entities) {
      if (!entity.hasCollision || entity.isStatic) continue;

      for (let other of this.entities) {
        if (entity === other || !aabbCollision(entity, other)) continue;

        if (other.hasCollision) resolveCollision(entity, other);

        this.checkForCollisionCustomBehavior(entity, other);
      }
    }
  }

  checkForCollisionCustomBehavior(entity, other) {
    //COLLISION SETTED WITH ENTITY INSTANCE
    if (entity.collisionWithMap.has(other)) {
      entity.collisionWithMap.get(other)(other);
    }

    //COLLISION SETTED WITH TAG
    for (const tag of other.tags) {
      if (!entity.collisionWithMap.has(tag)) continue;
      entity.collisionWithMap.get(tag)(other);
    }
  }

  render() {
    for (let entity of this.entities) {
      entity.render(this.renderer);
    }
  }
}
