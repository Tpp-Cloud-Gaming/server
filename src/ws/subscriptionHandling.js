import { UserGame } from "../models/UserGame.js";

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

  // TODO: Mandarle los offerers que ya estan conectados
}

export async function broadcastConnectionNotif(subscribers, usernameOfferer) {
  // Pedir los juegos y calificacion del usuario y mandarlo a todos los subs
  // TODO: Traer calificacion del usuario
  const calificacion = "5";

  // Busca los juegos
  const gamesOffered = await UserGame.findAll({
    where: { username: usernameOfferer },
    attributes: ["gamename"],
  }).then((data) => {
    return data.map((entity) => entity.get("gamename"));
  });

  let games = "";

  for (var i = 0; i < gamesOffered.length; i++) {
    games += "|" + gamesOffered[i];
  }

  if (games !== "") {
    for (let subscriber in subscribers) {
      subscribers[subscriber].send(
        `notifConnection|${usernameOfferer}|` + calificacion + games,
      );
    }
  }
}
