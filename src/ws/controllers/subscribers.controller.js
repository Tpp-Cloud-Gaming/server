import { UserController } from "../controllers/users.controller.js";
const userController = new UserController();

export class Subscribers {
    constructor() {
        this.subscribers = {};
    }

    addSubscriber(usernameSubscriber, ws, connectedOfferers) {
        this.subscribers[usernameSubscriber] = ws;
        console.log("subscriber with username: " + usernameSubscriber);
        this.sendOldConnectionNotif(connectedOfferers, usernameSubscriber);
    }

    deleteSubscriber(usernameSubscriber) {
        delete this.subscribers[usernameSubscriber];
    }

    async sendOldConnectionNotif(connectedOfferers, usernameSubscriber) {
        const calificacion = "5";
        for (let offerer in connectedOfferers) {
            const games = await buildGamesAndQualification(offerer);
            if (games !== "") {
                const message = `notifConnection|${offerer}|` + calificacion + games;
                console.log("msg", message);
                this.subscribers[usernameSubscriber].send(message);
            }
        }
    }

    async broadcastConnectionNotif(usernameOfferer) {
        const calificacion = "5";
        const games = await buildGamesAndQualification(usernameOfferer);
        if (games !== "") {
            const message =
              `notifConnection|${usernameOfferer}|` + calificacion + games;
            this.broadcastMessage(message);
          }
    }


    async broadcastDisconnectionNotif(usernameOfferer) {
        const message = `notifDisconnection|${usernameOfferer}`;
        this.broadcastMessage(message);
    }


    async broadcastMessage(message) {
        for (let subscriber in this.subscribers) {
            console.log("sending message to", subscriber);
            this.subscribers[subscriber].send(message);
        }
    }

    async sendPaymentNotification(usernameSubscriber) {
        const message = `notifPayment|${usernameSubscriber}`;
        if (!this.subscribers[usernameSubscriber]) {
            console.log("Subscriber not found");
            return;
        }
        
        this.subscribers[usernameSubscriber].send(message);
    }

    async removeSubscriber(ws) {
        for (let [key, value] of Object.entries(this.subscribers)) {
            if (value._closeCode === ws) {
              delete subscribers[key];
            console.log("Subscribers:", Object.keys(subscribers));
              break;
            }
          }
    }

}


async function buildGamesAndQualification(usernameOfferer) {
    // Busca los juegos
    const gamesOffered =
      await userController.getGamesOfferedAndQualification(usernameOfferer);
  
    let games = "";
  
    for (var i = 0; i < gamesOffered.length; i++) {
      games += "|" + gamesOffered[i];
    }
  
    return games;
  }