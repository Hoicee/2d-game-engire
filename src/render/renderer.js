import createREGL from "regl";

export function createRenderer(canvas) {
  const regl = createREGL({
    canvas: canvas,
  });

  return {
    camera: null,

    setCamera(camera) {
      this.camera = camera;
    },

    clear() {
      regl.clear({
        color: [0, 0, 0, 1],
      });
    },

    worldToScreen(pos) {
      if (!this.camera) return pos;

      return {
        x: pos.x - this.camera.position.x,
        y: pos.y - this.camera.position.y,
      };
    },

    _getContext() {
      return regl;
    },
  };
}
