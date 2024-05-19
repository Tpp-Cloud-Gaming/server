import { UserController } from "../controllers/users.controller.js";

const userController = new UserController();

export async function addSubscription(
  ws,
  messageFields,
  subscribers,
  connectedOfferers,
) {
  // subscribe|username
  var usernameSubscriber = messageFields[1];
  subscribers[usernameSubscriber] = ws;
  console.log("subscriber with username: " + usernameSubscriber);

  sendOldConnectionNotif(subscribers, connectedOfferers, usernameSubscriber);
}

export async function broadcastConnectionNotif(subscribers, usernameOfferer) {
  // Pedir los juegos y calificacion del usuario y mandarlo a todos los subs
  // TODO: Traer calificacion del usuario
  const calificacion = "5";

  // Busca los juegos
  const games = await buildGamesAndQualification(usernameOfferer);
  
  if (games !== "") {
    const message =
      `notifConnection|${usernameOfferer}|` + calificacion + games;
    broadcastMessage(message, subscribers);
  }
}

export async function sendOldConnectionNotif(
  subscribers,
  connectedOfferers,
  usernameSubscriber,
) {
  const calificacion = "5";
  for (let offerer in connectedOfferers) {
    const games = await buildGamesAndQualification(offerer);
    if (games !== "") {
      const message = `notifConnection|${offerer}|` + calificacion + games;
      console.log("msg", message);
      subscribers[usernameSubscriber].send(message);
    }
  }
}

export async function broadcastDisconnectionNotif(
  subscribers,
  usernameOfferer,
) {
  const message = `notifDisconnection|${usernameOfferer}`;
  broadcastMessage(message, subscribers);
}

function broadcastMessage(message, subscribers) {
  for (let subscriber in subscribers) {
    console.log("sending message to", subscriber);
    subscribers[subscriber].send(message);
  }
}

async function buildGamesAndQualification(usernameOfferer) {
  // Busca los juegos
  const gamesOffered =
    await userController.getGamesOfferedAndQualification(usernameOfferer);
  
  let games = "";

  for (var i = 0; i < gamesOffered.length; i++) {
    games += "|" + gamesOffered[i];
  }

  return games;
}
