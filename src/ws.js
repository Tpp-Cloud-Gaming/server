// Import the WebSocket library
import { WebSocketServer } from "ws";

// Define the port number for the server
const PORT = 4000;

// Create a WebSocket server instance
const wss = new WebSocketServer({ port: PORT });

let connectedOfferers = {};
let connectedClients = {};

// Handle new client connections
wss.on('connection', (ws) => {
    console.log('A new client connected.');

        
    // Handle incoming messages from the client
    ws.on('message', (message) => {
        console.log(connectedUsers);
        console.log(`Received message: ${message}`);
        const messageFields = message.toString().split("|");
        if (messageFields[0] === "init") {
            handleInitMessage(messageFields[1],messageFields[2]);
        }
        
        ws.send(`You said: ${message}`);
    }); 

    // Handle client disconnection
    ws.on('close', () => {
        console.log('A client disconnected.');
    });
});

// Log a message indicating the server is running
console.log(`WebSocket server is running on port ${PORT}`);

function handleInitMessage(role,username) {
    // TODO: Chequeos?
    if (role === "offerer") {
        connectedOfferers[username] = username;
    }
    else {
        connectedClients[username] = username;
    }
}
