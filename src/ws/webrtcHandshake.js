



export async function initOfferer(ws, messageFields, connectedOfferers) {
  // initOfferer|usernameOfferer  
  var usernameOfferer = messageFields[1];
      connectedOfferers[usernameOfferer] = ws;
      console.log("initOfferer with username: " + usernameOfferer);
}



export async function initClient(ws, messageFields,connectedClients, connectedOfferers) {
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