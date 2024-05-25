import { WebSocketServer } from "ws";
import { createServer } from "http";
import {
  offererSdp,
  clientSdp,
  initOfferer,
  disconnectOfferer,
  initClient,
} from "./ws/routes/handshake.routes.js";
import {subscriberController} from "./ws/controllers/subscribers.controller.js";
import { startSession, stopSession } from "./ws/routes/session.routes.js";
import { createApp } from "./app.js";
import { sequelize } from "./database/database.js";
import "./models/User.js";
import "./models/Game.js";
import "./models/UserGame.js";
import "./models/Payments.js"
import swaggerUi from "swagger-ui-express";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const swaggerFile = require("./swagger_output.json");
async function main() {
  await sequelize.authenticate();
  // await sequelize.sync({ force: true });
  console.log("Connection to Databases established");
}

await main();
const app = createApp();
app.disable("x-powered-by");
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Create a WebSocket server instance
const PORT = process.env.PORT || 3000;
const httpServer = createServer();
const wss = new WebSocketServer({ server: httpServer });
const CLOSEDSTATE = 3;

httpServer.on("request", app);
httpServer.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
});

let connectedOfferers = {};
let connectedClients = {};
let subscribers = subscriberController;
let onGoingSessions = [];


wss.on("connection", (ws) => {
  console.log("A new client connected.");
  ws.on("message", async (message) => {
    await handleMessage(message, ws);
  });
  
  ws.on("close", async (ws) => {    
    // TODO: Falta terminar sesiones
    // Delete the client from connectedClients
    for (let [key, value] of Object.entries(connectedClients)) {
      if (value._readyState === CLOSEDSTATE) {
        delete connectedClients[key];
        console.log("Clients left:", Object.keys(connectedClients));
        break;
      }
    }
    // Delete the offerer from connectedOfferers
    for (let [key, value] of Object.entries(connectedOfferers)) {
      if (value._readyState === CLOSEDSTATE) {
        delete connectedOfferers[key];
        await subscribers.broadcastDisconnectionNotif(key);
        console.log("Offerers left:", Object.keys(connectedOfferers));
        break;
      }
    }
    
    await subscribers.removeSubscriber(ws);
    // Lo borra si era suscriptor
    // await subscribers.removeSubscriber(ws);

    console.log("A client disconnected.");
  });
});

async function handleMessage(message, ws) {
  const messageFields = message.toString().split("|");
  const messageType = messageFields[0];
  switch (messageType) {
    case "initOfferer":
      initOfferer(ws, messageFields, subscribers, connectedOfferers);
      break;

    case "disconnectOfferer":      
      disconnectOfferer(messageFields, subscribers, connectedOfferers);
      break;

    case "initClient":
      initClient(ws, messageFields, connectedClients, connectedOfferers);
      break;

    case "offererSdp":
      offererSdp(ws, messageFields, connectedClients);
      break;

    case "clientSdp":
      clientSdp(ws, messageFields, connectedOfferers);
    break;

    case "subscribe":
      // addSubscription(ws, messageFields, subscribers, connectedOfferers);
      subscribers.addSubscriber(messageFields[1], ws, connectedOfferers);
      break;

    case "startSession":
      startSession(
        ws,
        messageFields,
        onGoingSessions,
        connectedClients,
        connectedOfferers,
      );
      break;

    case "stopSession":
      stopSession(ws, messageFields, onGoingSessions);
      break;
  }
}
