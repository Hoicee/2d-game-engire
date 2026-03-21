export class Input {
  constructor(canvas) {
    this.canvas = canvas;

    this.keys = {};
    this.mouse = {
      x: 0,
      y: 0,
      buttons: {},
    };

    this._initEvents();
  }

  _initEvents() {
    // KEYBOARD
    window.addEventListener("keydown", (e) => {
      this.keys[e.key] = true;
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.key] = false;
    });

    // MOUSE POSITION
    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();

      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    // MOUSE BUTTONS
    this.canvas.addEventListener("mousedown", (e) => {
      this.mouse.buttons[e.button] = true;
    });

    this.canvas.addEventListener("mouseup", (e) => {
      this.mouse.buttons[e.button] = false;
    });
  }

  // --- API ---
  isKeyPressed(key) {
    return !!this.keys[key];
  }

  isMousePressed(button) {
    return !!this.mouse.buttons[button];
  }

  getMousePosition() {
    return {
      x: this.mouse.x,
      y: this.mouse.y,
    };
  }
}
