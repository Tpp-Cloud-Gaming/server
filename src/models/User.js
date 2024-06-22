import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const User = sequelize.define(
  "users",
  {
    email: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    credits: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    longitude: {
      type: DataTypes.FLOAT,
    },
    latitude: {
      type: DataTypes.FLOAT,
    },
    mercadopago_mail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { timestamps: false },
);
