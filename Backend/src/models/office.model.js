import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Office = sequelize.define(
  "Offices",
  {
    office_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    timestamps: true,
  }
);

export default Office;