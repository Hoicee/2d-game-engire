import { startGame } from "./index.js";
import { Vec2 } from "./math/vec2.js";

const canvas = document.getElementById("game");

const game = await startGame(canvas, { w: 600, h: 500, resizeTo: window });

const scene = game.createScene();
// scene.setCameraSmoothness(0.1);
scene.setCameraOffset(50, 50);

const player = game.createEntity(game.physics());

scene.setCameraFollow(player);

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

const text = game.createEntity();

text.makeText("oi", 100, 100, {
  fontSize: 24,
});

text.fixedPosition = true;

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
  other.destroy();
});

let playerTrackMouse = false;

player.onClick((x, y) => {
  playerTrackMouse = true;
});

game.onReleased(() => {
  playerTrackMouse = false;
});

function movement() {
  const input = game.getInput();

  if (!input.isKeyDown("a") && !input.isKeyDown("d")) {
    player.play("idle");
    player.setVelocity(0);
  }

  if (input.isKeyDown("a")) {
    player.setFlip(true);
    player.play("run");
    player.setAcceleration(-1000);
  }

  if (input.isKeyDown("d")) {
    player.setFlip(false);
    player.play("run");
    player.setAcceleration(1000);
  }

  if (input.isKeyPressed(" ") && player.isGrounded) {
    player.setVelocity(player.velocity.x, -500);
  }

  if (input.isKeyReleased(" ")) {
    if (player.velocity.y < 0) {
      player.setVelocity(player.velocity.x, player.velocity.y * 0.5);
    }
  }

  if (playerTrackMouse) {
    player.useGravity = false;
    const worldMouse = game.getMouseWorld();
    player.setPosition(
      worldMouse.x,
      worldMouse.y + (player.size.y * player.anchor.y) / 2,
    );
  } else {
    player.useGravity = true;
  }
}

let toggle = true;
scene.onUpdate = async function (dt) {
  const input = game.getInput();

  movement();

  if (input.isKeyPressed("t")) {
    text.changeText("hello");
    ground.setSize(100, 100);
  }
};

game.pushScene(scene);
game.start();

const menuScene = game.createScene();

const screenSize = game.renderer.getScreenSize();

const box = game.createEntity(
  game.pos(screenSize.width / 2, screenSize.height / 2),
  game.size(200, 200),
  game.rect(),
  game.anchor(0.5, 0.5),
);

menuScene.addEntity(box);

game.pushScene(menuScene);

menuScene.onUpdate = (dt) => {
  if (game.input.isKeyPressed("g")) {
    box.setSize(300, 50);
    box.setPosition(screenSize.width / 2, screenSize.height / 2);
  }
};
