import { Game, Scene, Entity } from "./index.js";

const canvas = document.getElementById("game");

const game = new Game(canvas);
await game.init();

const scene = new Scene(game);

const player = new Entity();
player.useGravity = true;
player.hasCollision = true;
player.friction = 0.99;

scene.addEntity(player);
scene.getCamera().follow(player);
scene.camera.smoothness = 0.1;

const ground = new Entity();
ground.isStatic = true;
ground.hasCollision = true;
ground.size.set(400, 50);
ground.position.set(0, 400);
ground.color = "green";

scene.addEntity(ground);

scene.onUpdate = function (dt) {
  const input = game.getInput();

  if (input.isKeyDown("a")) {
    player.setAcceleration(-1000, 0);
  }

  if (input.isKeyDown("d")) {
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
