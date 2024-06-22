import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../database/database.js";
import { User } from "./User.js";

export const Payment = sequelize.define(
  "payments",
  {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      references: {
        model: User,
        key: "username",
      },
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
  },
  { timestamps: false },
);

User.hasMany(Payment, { foreignKey: "username" });
Payment.belongsTo(User, { foreignKey: "username", sourceKey: "username" });
