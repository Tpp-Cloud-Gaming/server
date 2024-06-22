import { Session } from "../controllers/session.controller.js";

export async function startSession(
  ws,
  messageFields,
  onGoingSessions,
  connectedClients,
  connectedOfferers,
  subscribers,
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
  var minutes = messageFields[3];

  for (let session of onGoingSessions) {
    if (session.isOnSession(offerer) || session.isOnSession(client)) {
      //ws.send("One of the users is already in a session.");
      console.log("One of the users is already in a session.");
      return;
    }
  }

  const session = new Session(offerer, client);
  session.startSession(
    minutes,
    onGoingSessions,
    connectedClients,
    connectedOfferers,
    subscribers,
  );
  onGoingSessions.push(session);
  subscribers.broadcastMessage(`sessionStarted|${offerer}|${client}`);
}

export async function forceStopSession(
  ws,
  messageFields,
  onGoingSessions,
  subscribers,
) {
  console.log("Force stopping session...");

  var sessionTerminator = messageFields[1];
  var sessionIndex = onGoingSessions.findIndex((s) =>
    s.isOnSession(sessionTerminator),
  );

  if (sessionIndex !== -1) {
    var session = onGoingSessions[sessionIndex];
    session.stopSession();
    const sessionTime = session.getElapsedTime();
    // subscribers.sendEndSessionNotification(offerer, client, sessionTime);
    onGoingSessions.splice(sessionIndex, 1);
    const offerer = session.getOfferer();
    const client = session.getClient();
    subscribers.sendForceStopSessionNotification(
      sessionTerminator,
      offerer,
      client,
      sessionTime,
    );
  } else {
    // ws.send("Session not found.");
  }
}

export async function stopSession(
  totalMinutes,
  onGoingSessions,
  connectedClients,
  connectedOfferers,
  offerer,
  client,
  subscribers,
) {
  console.log("Stopping session by timer...");

  var sessionIndex = onGoingSessions.findIndex(
    (s) => s.isOnSession(offerer) && s.isOnSession(client),
  );

  console.log("Session index:", sessionIndex);

  if (sessionIndex !== -1) {
    var session = onGoingSessions[sessionIndex];

    session.stopSession();
    const sessionTime = session.getElapsedTime();
    // console.log(`Session between ${session.name1} and ${session.name2} stopped.`);

    subscribers.sendEndSessionNotification(
      totalMinutes,
      connectedClients,
      connectedOfferers,
      offerer,
      client,
    );

    onGoingSessions.splice(sessionIndex, 1);
  } else {
    // ws.send("Session not found.");
  }

  if (onGoingSessions.length == 0) {
    console.log("No sessions are on going.");
  }
}
