// Import the WebSocket library
import { WebSocketServer } from "ws";
import { createServer } from "http";
import { app } from "./index.js";
import {offererSdp,clientSdp, initOfferer, initClient} from "./ws/webrtcHandshake.js";
import { getUsersForGames } from "./ws/sessionHandling.js";


// Create a WebSocket server instance
const PORT = process.env.PORT || 3000;
const httpServer = createServer();
const wss = new WebSocketServer({ server: httpServer });

httpServer.on("request", app);
httpServer.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
});

let connectedOfferers = {};
let connectedClients = {};

wss.on("connection", (ws) => {
  console.log("A new client connected.");
  ws.on("message", async (message) => {
    await handleMessage(message, ws);
  });

  ws.on("close", () => {
    console.log("A client disconnected.");
  });
});

async function handleMessage(message, ws) {
  const messageFields = message.toString().split("|");
  const messageType = messageFields[0];
  switch (messageType) {
    
    case "initOfferer":
      initOfferer(ws, messageFields, connectedOfferers);
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

    case "getUsersForGames":      
      getUsersForGames(ws, messageFields, connectedOfferers);
}
}
