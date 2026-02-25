import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Role = sequelize.define(
  "CPTRoles",
  {
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export default Role;