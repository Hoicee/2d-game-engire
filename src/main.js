import { startGame } from "./index.js";

const canvas = document.getElementById("game");

const game = await startGame(canvas, { resizeTo: window });

const player = game.createEntity(game.physics());

const scene = game.createScene();
scene.setCameraFollow(player);
scene.setCameraSmoothness(0.1);

const ground = game.createEntity(
  game.pos(0, 400),
  game.size(400, 50),
  game.color("green"),
  game.tags("ground"),
  game.rect(),
  game.solid(),
);

const ground2 = game.createEntity(
  game.pos(100, 200),
  game.size(400, 100),
  game.color("blue"),
  game.solid(),
  game.rect(),
);

const text = game.createEntity(game.pos(50, 50));

text.makeText("oie", 50, 50, {
  fontSize: 24,
});

scene.addEntityList(player, ground, ground2, text);

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

player.component(game.pos(100, 100));

player.onCollisionWith("ground", (other) => {
  // other.destroy();
});

function movement() {
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
}

scene.onUpdate = function (dt) {
  const input = game.getInput();

  movement();

  if (input.isKeyPressed("r")) {
    text.changeText("hello");
    ground.setSize(100, 100);
  }
};

game.pushScene(scene);
game.start();
