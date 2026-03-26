import { Camera } from "./camera.js";
import {
  aabbCollision,
  pointInEntity,
  resolveCollision,
} from "../math/collision.js";
import { clamp } from "../math/helpers.js";
import { Vec2 } from "../math/vec2.js";

export class Scene {
  constructor(game) {
    this.game = game;
    this.renderer = this.game.renderer;
    this.entities = [];
    this.camera = new Camera();

    this.mouse = this.game.input.mouse;

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

  setCameraOffset(x, y) {
    this.camera.setOffset(x, y);
  }

  init() {
    if (!this.renderEnabled) return;
    for (const entity of this.entities) {
      this.renderer.addToStage(entity.view);
    }
  }

  disableUpdate() {
    this.updateEnabled = false;
  }

  enableUpdate() {
    this.updateEnabled = true;
  }

  disableRender() {
    for (const entity of this.entities) {
      this.renderer.removeFromStage(entity.view);
    }
    this.updateEnabled = false;
    this.renderEnabled = false;
  }

  enableRender() {
    this.renderEnabled = true;
    this.init();
  }

  destroy() {}

  onUpdate(dt) {}

  update(dt) {
    this.onUpdate(dt);

    for (let entity of this.entities) {
      entity.update(dt, this.renderer);

      const worldMouse = this.camera.screenToWorld(
        new Vec2(this.mouse.x, this.mouse.y),
      );

      const hovering = pointInEntity(worldMouse.x, worldMouse.y, entity);

      if (!hovering) continue;

      if (this.mouse.pressed) {
        entity.onClickList.forEach((fn) =>
          fn(this.mouse.x, this.mouse.y, entity),
        );
      }

      if (this.mouse.down) {
        entity.onHoldList.forEach((fn) =>
          fn(this.mouse.x, this.mouse.y, entity, dt),
        );
      }

      if (this.mouse.released) {
        entity.onReleasedList.forEach((fn) =>
          fn(this.mouse.x, this.mouse.y, entity),
        );
      }
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
