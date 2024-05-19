import { UserGame } from "../../models/UserGame.js";

export class UserController {
  constructor() {}

  getGamesOfferedAndQualification = async (usernameOfferer) => {
    const gamesOffered = await UserGame.findAll({
      where: { username: usernameOfferer },
      attributes: ["gamename"],
    }).then((data) => {
      return data.map((entity) => entity.get("gamename"));
    });
    return gamesOffered;
  };

  getGamePathForUser = async (usernameOfferer, gameName) => {
    const userGameInfo = await UserGame.findAll({
      where: { username: usernameOfferer, gamename: gameName },
      attributes: ["path"],
    }).then((data) => {
      return data.map((entity) => entity.get("path"));
    });
    const gamePath = userGameInfo[0];
    return gamePath;
  };
}
