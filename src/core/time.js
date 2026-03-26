export class Time {
  constructor() {
    this.last = 0;
    this.delta = 0;

    this.timers = [];
  }

  update(current) {
    if (this.last === 0) {
      this.last = current;
    }

    this.delta = (current - this.last) / 1000;
    this.delta = Math.min(this.delta, 0.033);

    this.updateTimers();

    this.last = current;
  }

  wait(seconds) {
    return new Promise((resolve) => {
      this.timers.push({ time: seconds, resolve, resolved: false });
    });
  }

  updateTimers() {
    for (const timer of this.timers) {
      timer.time -= this.delta;

      if (timer.time <= 0) {
        timer.resolve();
        timer.resolved = true;
      }
    }

    this.timers = this.timers.filter((t) => !t.resolved);
  }
}
