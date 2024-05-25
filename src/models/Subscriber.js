

class Subscribers {
    constructor() {
        this.subscribers = {};
    }

    addSubscriber(usernameSubscriber, ws) {
        this.subscribers[usernameSubscriber] = ws;
        console.log("New subscriber with username: " + usernameSubscriber);
        console.log("Actual subscribers", Object.keys(this.subscribers));
        // console.log("Suscribers", this.subscribers);

    }

    deleteSubscriber(usernameSubscriber) {
        delete this.subscribers[usernameSubscriber];
    }

    getSubscriber(usernameSubscriber) {
        return this.subscribers[usernameSubscriber];
    }

    getAllSubscribers() {
        return this.subscribers;
    }

};


export const subscribers = new Subscribers();