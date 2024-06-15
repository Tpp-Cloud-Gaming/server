import { Session } from "../controllers/session.controller.js";

export async function startSession(
  ws,
  messageFields,
  onGoingSessions,
  connectedClients,
  connectedOfferers,
  subscribers
) {
  
  if (!connectedOfferers[messageFields[1]]) {
    // ws.send("Offerer not found.");
    return;
  }
   
  
  if (!connectedClients[messageFields[2]]) {
    // ws.send("Client not found.");
    return;
  }
  
  var offerer = messageFields[1];
  var client = messageFields[2];
  
  
  for (let session of onGoingSessions) {
    if (session.isOnSession(offerer) || session.isOnSession(client)) {
      //ws.send("One of the users is already in a session.");
      console.log("One of the users is already in a session.");
      return;
    }
  }
  
  const session = new Session(offerer, client);
  session.startSession();  
  onGoingSessions.push(session);
  subscribers.broadcastMessage(`sessionStarted|${offerer}|${client}`);
}

export async function stopSession(ws, messageFields, onGoingSessions, subscribers) {
  
  console.log("Stopping session...");

  var offerer = messageFields[1];
  var client = messageFields[2];

  var sessionIndex = onGoingSessions.findIndex(
    (s) => s.isOnSession(offerer) && s.isOnSession(client),
  );
  
  
  console.log("Session index:", sessionIndex);

  if (sessionIndex !== -1) {
    var session = onGoingSessions[sessionIndex];
    
    
    session.stopSession();
    const sessionTime = session.getElapsedTime();
    // console.log(`Session between ${session.name1} and ${session.name2} stopped.`);
    
    subscribers.sendEndSessionNotification(offerer, client, sessionTime);
    

    onGoingSessions.splice(sessionIndex, 1);
  } else {
    // ws.send("Session not found.");
  }

  if (onGoingSessions.length == 0) {
    console.log("No sessions are on going.");
  }
}
