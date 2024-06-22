import { UserGame } from "../../models/UserGame.js";
import { User } from "../../models/User.js";
import { sequelize } from "../../database/database.js";

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

  updateCredits = async (usernameOfferer, usernameClient, new_credits) => {
    await sequelize.transaction(async (t) => {
      const updatedOfferer = await User.findOne({
        where: { username: usernameOfferer },
        transaction: t,
      });
      console.log("offerer: ", updatedOfferer);
      updatedOfferer.credits += new_credits;
      await updatedOfferer.save({ transaction: t });

      const updatedClient = await User.findOne({
        where: { username: usernameClient },
        transaction: t,
      });
      console.log("offerer: ", updatedClient);
      updatedClient.credits -= new_credits;
      await updatedClient.save({ transaction: t });
    });
  };
}
