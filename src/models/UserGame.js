import { DataTypes } from "sequelize";

import { sequelize } from "../database/database.js";
import { User } from "./User.js";
import { Game } from "./Game.js";

export const UserGame = sequelize.define(
  "usergames",
  {
    path: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: false },
);

User.belongsToMany(Game, {
  through: UserGame,
  foreignKey: "username",
  sourceKey: "username",
});
Game.belongsToMany(User, { through: UserGame, foreignKey: "gamename" });
