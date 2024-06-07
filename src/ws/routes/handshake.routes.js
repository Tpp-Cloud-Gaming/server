// import {
//   broadcastConnectionNotif,
//   broadcastDisconnectionNotif,
// } from "./subscription.routes.js";
import { UserController } from "../controllers/users.controller.js";


const userController = new UserController();

export async function initOfferer(
  ws,
  messageFields,
  subscribers,
  connectedOfferers,
) {
  // initOfferer|usernameOfferer
  var usernameOfferer = messageFields[1];
  
  if (connectedOfferers[usernameOfferer]) {   
    console.log(`Offerer ${usernameOfferer} already connected`);
    return;
  }

  connectedOfferers[usernameOfferer] = ws;
  console.log("initOfferer with username: " + usernameOfferer);
  subscribers.broadcastConnectionNotif(usernameOfferer);
  //broadcastConnectionNotif(subscribers, usernameOfferer);
}

export async function disconnectOfferer(
  messageFields,
  subscribers,
  connectedOfferers,
) {
  // disconnectOfferer|usernameOfferer
  var usernameOfferer = messageFields[1];
  console.log("disconnectOfferer with username: " + usernameOfferer);
  delete connectedOfferers[usernameOfferer];
  subscribers.broadcastDisconnectionNotif(usernameOfferer);
  // broadcastDisconnectionNotif(subscribers, usernameOfferer);
}

export async function initClient(
  ws,
  messageFields,
  connectedClients,
  connectedOfferers,
) {
  // initClient|usernameClient|usernameOfferer|gameName
  var usernameClient = messageFields[1];
  var usernameOfferer = messageFields[2];
  var gameName = messageFields[3];
  connectedClients[usernameClient] = ws;

  // sdpRequestFrom|usernameClient|gameName|gamePath
  if (connectedOfferers[usernameOfferer]) {
    const gamePath = await userController.getGamePathForUser(
      usernameOfferer,
      gameName,
    );

    connectedOfferers[usernameOfferer].send(
      `sdpRequestFrom|${usernameClient}|${gameName}|${gamePath}`,
    );    
  } else {
    ws.send("Offerer not found"); // TODO: definir un mensaje especifico
  }
}

export async function offererSdp(ws, messageFields, connectedClients) {
  // offererSdp|usernameClient| <sdp>
  var usernameClient = messageFields[1];
  var sdpOfferer = messageFields[2];
  if (connectedClients[usernameClient]) {
    connectedClients[usernameClient].send(`sdpOfferer|${sdpOfferer}`);
  } else {
    ws.send("Client not found");
  }
}

export async function clientSdp(ws, messageFields, connectedOfferers) {
  // clientSdp|usernameOfferer| <sdp>
  var usernameOfferer = messageFields[1];
  var sdpClient = messageFields[2];
  if (connectedOfferers[usernameOfferer]) {
    connectedOfferers[usernameOfferer].send(`sdpClient|${sdpClient}`);
  } else {
    ws.send("Offerer not found");
  }
}
