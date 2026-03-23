import { Game, Scene, Entity, Sprite, SpriteSheet } from "./index.js";
import { Animation as Anim } from "./index.js";
import * as PIXI from "pixi.js";

const canvas = document.getElementById("game");

canvas.imageSmoothingEnabled = false;
canvas.mozImageSmoothingEnabled = false;
canvas.webkitImageSmoothingEnabled = false;
canvas.msImageSmoothingEnabled = false;

const game = new Game(canvas);
await game.init();

const scene = game.createScene();

const player = game.createEntity();
player.useGravity = true;
player.hasCollision = true;
player.friction = 0.98;
player.debug = true;

scene.addEntity(player);
scene.getCamera().follow(player);
scene.camera.smoothness = 0.1;

const ground = game.createEntity();
ground.isStatic = true;
ground.hasCollision = true;
ground.size.set(400, 50);
ground.position.set(0, 400);
ground.color = "green";

scene.addEntity(ground);

const texture = await PIXI.Assets.load("../assets/knight.png");

const sheet = new SpriteSheet(texture);

const frames = sheet.generateGrid({
  startX: 8,
  startY: 8,
  frameWidth: 16,
  frameHeight: 20,
  gapX: 16,
  columns: 4,
  rows: 1,
});

const sprite = new Sprite(texture);
sprite.setScale(2);

sprite.addAnimation("idle", new Anim(frames, { speed: 5 }));

sprite.play("idle");

player.addSprite(sprite, game.renderer);

scene.onUpdate = function (dt) {
  const input = game.getInput();

  if (input.isKeyDown("a")) {
    player.sprite.getView().scale.x = -player.sprite.scale;
    player.setAcceleration(-1000, 0);
  }

  if (input.isKeyDown("d")) {
    player.sprite.getView().scale.x = player.sprite.scale;
    player.setAcceleration(1000, 0);
  }

  if (input.isKeyPressed(" ") && player.isGrounded) {
    player.setVelocity(player.velocity.x, -500);
  }

  if (input.isKeyReleased(" ")) {
    if (player.velocity.y < 0) {
      player.setVelocity(player.velocity.x, player.velocity.y * 0.5);
    }
  }
};
game.pushScene(scene);
game.start();
