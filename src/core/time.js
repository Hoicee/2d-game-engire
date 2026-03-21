export class Time {
  constructor() {
    this.last = 0;
    this.delta = 0;
  }

  update(current) {
    if (this.last === 0) {
      this.last = current;
    }

    this.delta = (current - this.last) / 1000;
    this.delta = Math.min(this.delta, 0.033);

    this.last = current;
  }
}
