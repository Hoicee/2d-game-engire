export class Input {
  constructor(canvas) {
    this.keys = {};
    this.prevKeys = {};

    this.mouse = { x: 0, y: 0, down: false, pressed: false, released: false };

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

    canvas.addEventListener("mousedown", () => {
      this.mouse.down = true;
      this.mouse.pressed = true;
    });

    canvas.addEventListener("mouseup", () => {
      this.mouse.down = false;
      this.mouse.released = true;
    });
  }

  update() {
    this.prevKeys = { ...this.keys };
    this.mouse.pressed = false;
    this.mouse.released = false;
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
