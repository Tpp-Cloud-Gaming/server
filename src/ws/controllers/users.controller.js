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
    
      
      let updatedOfferer = await User.findOne({
          where: { username: usernameOfferer }        
      });
      updatedOfferer.credits += parseInt(new_credits);
  
      await updatedOfferer.save();
  
      let updatedClient = await User.findOne({
        where: { username: usernameClient }
      });
  
      updatedClient.credits -= parseInt(new_credits);
      await updatedClient.save();
    
    
  };
}
