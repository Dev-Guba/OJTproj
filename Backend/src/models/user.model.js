import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define(
  "CPTUsers",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    EmployeeNo: {
      type: DataTypes.STRING(20),
      allowNull: true,
      references: {
        model: "Employees",
        key: "EmployeeNo",
      },
    },

    SameDeptCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "CPTRoles",
        key: "role_id",
      },
    },
  },
  {
    timestamps: false,
  }
);

export default User;