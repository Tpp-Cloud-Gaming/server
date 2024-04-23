// Import the WebSocket library
import { WebSocketServer } from "ws";
import { createServer } from "http";
import { app } from "./index.js";
import { UserGame } from "./models/UserGame.js";

// Define the port number for the server
const PORT = process.env.PORT || 3000;

// Create a WebSocket server instance
const httpServer = createServer();
const wss = new WebSocketServer({ server: httpServer });
httpServer.on("request", app);
httpServer.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
});

let connectedOfferers = {};
let connectedClients = {};
// Handle new client connections
wss.on("connection", (ws) => {
  console.log("A new client connected.");
  ws.on("message", async (message) => {
    await handleMessage(message, ws);
  });

  ws.on("close", () => {
    console.log("A client disconnected.");
  });
});

//console.log(`WebSocket server is running on port ${PORT}`);

async function handleMessage(message, ws) {
  const messageFields = message.toString().split("|");
  // messageType | .....
  const messageType = messageFields[0];

  switch (messageType) {
    case "initOfferer":
      // initOfferer|usernameOfferer
      var usernameOfferer = messageFields[1];
      connectedOfferers[usernameOfferer] = ws;
      console.log("initOfferer with username: " + usernameOfferer);
      break;
    case "initClient":
      // initClient|usernameClient|usernameOfferer|gameName
      var usernameClient = messageFields[1];
      var usernameOfferer = messageFields[2];
      var gameName = messageFields[3];
      connectedClients[usernameClient] = ws;

      if (connectedOfferers[usernameOfferer]) {
        connectedOfferers[usernameOfferer].send(
          `sdpRequestFrom|${usernameClient}|${gameName}`,
        );
      } else {
        ws.send("Offerer not found"); // TODO: definir un mensaje especifico
      }
      break;

    case "offererSdp":
      // offererSdp|usernameClient| <sdp>
      var usernameClient = messageFields[1];
      var sdpOfferer = messageFields[2];
      if (connectedClients[usernameClient]) {
        connectedClients[usernameClient].send(`sdpOfferer|${sdpOfferer}`);
      } else {
        ws.send("Client not found");
      }
      break;

    case "clientSdp":
      // clientSdp|usernameOfferer| <sdp>
      var usernameOfferer = messageFields[1];
      var sdpClient = messageFields[2];
      if (connectedOfferers[usernameOfferer]) {
        connectedOfferers[usernameOfferer].send(`sdpClient|${sdpClient}`);
      } else {
        ws.send("Offerer not found");
      }
      break;

    case "getUsersForGames":
      // getUsersForGames
      var gameName = messageFields[1];
      // Consulta  a la base de datos
      const possibleUsers = await UserGame.findAll({
        where: { gamename: gameName },
        attributes: ["username"],
      }).then((data) => {
        return data.map((entity) => entity.get("username"));
      });

      let offerers = "";
      for (let connectedUser in connectedOfferers) {
        for (var i = 0; i < possibleUsers.length; i++) {
          if (connectedUser === possibleUsers[i]) {
            offerers += "|" + connectedUser;
          }
        }
      }
      console.log(offerers);
      ws.send("usersForGame" + offerers);
  }
}
