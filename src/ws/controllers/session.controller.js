import { stopSession } from "../routes/session.routes.js";

export class Session {
  constructor(offerer, client) {
    this.offerer = offerer;
    this.client = client;
    this.timer = null;
    this.startTime = null;
    this.elapsedTime = null;
    this.finished = false;
  }

  startSession(
    totalMinutes,
    onGoingSessions,
    connectedClients,
    connectedOfferers,
    subscribers,
  ) {
    console.log(`Session started between ${this.offerer} and ${this.client}`);
    this.startTime = Date.now();
    console.log("total minutes", totalMinutes);
    this.timer = setInterval(async () => {
      if (this.finished) {
        clearInterval(this.timer);
        return;
      }
      const currentTime = new Date();
      const elapsedTime = (currentTime - this.startTime) / 1000 / 60; // Convert to minutes

      console.log(`Timer running: ${elapsedTime} minutes`);
      //console.log("Sessions: ", onGoingSessions);

      if (elapsedTime >= totalMinutes) {
        console.log(`Session finished after ${elapsedTime} minutes`);
        this.finished = true;
        clearInterval(this.timer);
        await stopSession(
          totalMinutes,
          onGoingSessions,
          connectedClients,
          connectedOfferers,
          this.offerer,
          this.client,
          subscribers,
        );
        return;
      }
    }, 10000);
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
      this.elapsedTime = parseInt((endTime - this.startTime) / 1000 / 60); // Elapsed time in minutes
      console.log(`Timer stopped: ${this.elapsedTime} minutes`);
    } else {
      console.log("Timer is not running.");
    }
  }
}
