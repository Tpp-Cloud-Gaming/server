import {Session} from '../controllers/session.controller.js';


export async function startSession(
    ws,
    messageFields,
    onGoingSessions,
    connectedClients,
    connectedOfferers,
){
    
    var offerer = connectedOfferers[messageFields[1]];
    var client = connectedClients[messageFields[2]];
    
    if (!offerer) {
        ws.send("Offerer not found.");
        return;
    }

    if (!client) {
        ws.send("Client not found.");
        return;
    }

    for (let session of onGoingSessions) {
        if (session.isOnSession(offerer) || session.isOnSession(client)) {
            //ws.send("One of the users is already in a session.");
            console.log("One of the users is already in a session.");
            return;
        }
    }

    const session = new Session(messageFields[1], messageFields[2]);
    session.startSession();
    onGoingSessions.push(session);
     

}


export async function stopSession(ws, messageFields, onGoingSessions){
    var offerer = messageFields[1];
    var client = messageFields[2];

    var session = onGoingSessions.find(s => s.isOnSession(offerer) && s.isOnSession(client));
    if (session) {
        session.stopSession();
        onGoingSessions = onGoingSessions.filter(s => s !== session);
    } else {
        ws.send("Session not found.");
    }
    
    if (onGoingSessions.length == 0) {
        console.log("No sessions are on going.");
    }
}