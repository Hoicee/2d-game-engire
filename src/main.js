import { Game, Scene, Entity } from "./index.js";

const canvas = document.getElementById("game");

const game = new Game(canvas);

const scene = new Scene();

const player = new Entity();
player.useGravity = true;

scene.addEntity(player);

scene.update = function (dt) {
  Scene.prototype.update.call(this, dt);

  console.log(player.position.y);
};

game.pushScene(scene);
game.start();
