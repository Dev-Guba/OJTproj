import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Status = sequelize.define(
  "CPTStatus",
  {
    statusId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    statusCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    statusDesc: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: false,
  }
);

export default Status;