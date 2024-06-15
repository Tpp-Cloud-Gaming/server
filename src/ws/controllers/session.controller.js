export class Session {
  constructor(offerer, client) {
    this.offerer = offerer;
    this.client = client;
    this.timer = null;
    this.startTime = null;
    this.elapsedTime = null;
    this.finished = false;
  }

  startSession() {
    console.log(`Session started between ${this.offerer} and ${this.client}`);
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
    return name === this.offerer || name === this.client;
  }

  getParticipants() {
    return [this.offerer, this.client];
  }

  getOfferer() {
    return this.offerer;
  }

  getClient() {
    return this.client;
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