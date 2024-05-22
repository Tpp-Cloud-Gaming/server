

class Subscribers {
    constructor() {
        this.subscribers = {};
    }

    addSubscriber(usernameSubscriber, ws) {
        this.subscribers[usernameSubscriber] = ws;
        console.log("subscriber with username: " + usernameSubscriber);
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