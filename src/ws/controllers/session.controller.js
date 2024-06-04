export class Session {
  constructor(name1, name2) {
    this.name1 = name1;
    this.name2 = name2;
    this.timer = null;
    this.startTime = null;
    this.elapsedTime = null;
    this.finished = false;
  }

  startSession() {
    console.log(`Session started between ${this.name1} and ${this.name2}`);
    this.startTime = Date.now();
    this.timer = setInterval(() => {
      if (this.finished) {
        clearInterval(this.timer);
        return;
      }
      const currentTime = new Date();
      // console.log(
      //   `Timer running: ${(currentTime - this.startTime) / 1000} seconds`,
      // );
    }, 2000);
  }

  isOnSession(name) {
    return name === this.name1 || name === this.name2;
  }

  getParticipants() {
    return [this.name1, this.name2];
  }

  getElapsedTime() {
    return this.elapsedTime;
  }

  stopSession() {
    this.finished = true;
    if (this.timer) {
      clearInterval(this.timer);
      const endTime = new Date();
      this.elapsedTime = (endTime - this.startTime) / 1000; // Elapsed time in seconds
      console.log(`Timer stopped: ${this.elapsedTime} seconds`);
    } else {
      console.log("Timer is not running.");
    }
  }
}
