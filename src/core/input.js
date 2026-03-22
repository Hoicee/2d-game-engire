export class Input {
  constructor(canvas) {
    this.keys = {};
    this.prevKeys = {};

    this.mouse = { x: 0, y: 0 };

    window.addEventListener("keydown", (e) => {
      this.keys[e.key.toLowerCase()] = true;
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();

      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });
  }

  update() {
    this.prevKeys = { ...this.keys };
  }

  isKeyDown(key) {
    return !!this.keys[key];
  }

  isKeyPressed(key) {
    return this.keys[key] && !this.prevKeys[key];
  }

  isKeyReleased(key) {
    return !this.keys[key] && this.prevKeys[key];
  }

  getMousePosition() {
    return { ...this.mouse };
  }
}
