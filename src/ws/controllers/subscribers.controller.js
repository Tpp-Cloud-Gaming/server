import { UserController } from "../controllers/users.controller.js";
import { subscribers } from "../../models/Subscriber.js";
const userController = new UserController();

export class SubscriberController {
    constructor() {
        this.subscribers = subscribers;
    }

    addSubscriber(usernameSubscriber, ws, connectedOfferers) {
        this.subscribers.addSubscriber(usernameSubscriber,ws);
        this.sendOldConnectionNotif(connectedOfferers, usernameSubscriber);
    }

    deleteSubscriber(usernameSubscriber) {
        this.subscribers.deleteSubscriber(usernameSubscriber);
    }

    async sendOldConnectionNotif(connectedOfferers, usernameSubscriber) {
        const calificacion = "5";
        for (let offerer in connectedOfferers) {
            const games = await buildGamesAndQualification(offerer);
            if (games !== "") {
                const message = `notifConnection|${offerer}|` + calificacion + games;
                console.log("msg", message);
                this.subscribers.getSubscriber(usernameSubscriber).send(message);
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
        
        for (let [subscriber,ws] of Object.entries(this.subscribers.getAllSubscribers())) {
            console.log("sending message to", subscriber);
            ws.send(message);
        }
    }

    async sendPaymentNotification(usernameSubscriber) {
        const message = `notifPayment|${usernameSubscriber}`;
        if (!this.subscribers.getSubscriber(usernameSubscriber)) {
            console.log("Subscriber not found");
            return;
        }
        
        this.subscribers.getSubscriber(usernameSubscriber).send(message);
    }

    async removeSubscriber(ws) {
        for (let [subscriber,value] of Object.entries(this.subscribers.getAllSubscribers())) {
            if (value._closeCode === ws) {
                this.subscribers.deleteSubscriber(subscriber);
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

export const subscriberController = new SubscriberController();