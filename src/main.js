import { startGame } from "./index.js";

const canvas = document.getElementById("game");

const game = await startGame(canvas);

const player = game.createEntity();
player.useGravity = true;
player.hasCollision = true;
player.friction = 0.97;
player.debug = true;

const scene = game.createScene();

scene.addEntity(player);
scene.getCamera().follow(player);
scene.camera.smoothness = 0.1;

const ground = game.createEntity();
ground.isStatic = true;
ground.hasCollision = true;
ground.size.set(400, 50);
ground.position.set(0, 400);
ground.color = "green";

const ground2 = game.createEntity();
ground2.isStatic = true;
ground2.hasCollision = true;
ground2.size.set(400, 1000);
ground2.position.set(100, 200);
ground2.color = "red";

scene.addEntity(ground);
scene.addEntity(ground2);

const knight = await game.loadSprite("knight", "../assets/knight.png");

knight.addAnimation(
  "idle",
  {
    startX: 8,
    startY: 8,
    frameWidth: 16,
    frameHeight: 20,
    gapX: 16,
    columns: 4,
    rows: 1,
  },
  5,
);

knight.addAnimation(
  "run",
  {
    startX: 8,
    startY: 8 + 32,
    frameWidth: 16,
    frameHeight: 20,
    gapX: 16,
    columns: 4,
    rows: 1,
  },
  5,
);

player
  .setSprite("knight", {
    x: 8,
    y: 8,
    w: 16,
    h: 20,
  })
  .setScale(2);

scene.onUpdate = function (dt) {
  const input = game.getInput();

  if (!input.isKeyDown("a") && !input.isKeyDown("d")) {
    player.play("idle");
  }

  if (input.isKeyDown("a")) {
    player.setFlip(true);
    player.play("run");
    player.setAcceleration(-1000, 0);
  }

  if (input.isKeyDown("d")) {
    player.setFlip(false);
    player.play("run");
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
