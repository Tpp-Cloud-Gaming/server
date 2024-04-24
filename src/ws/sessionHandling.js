import { UserGame } from "../models/UserGame.js";

export async function getUsersForGames(ws, messageFields, connectedOfferers) {
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
