import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Backlog = sequelize.define(
  "Backlog",
  {
    tracking_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    records_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    article_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    previous_employee_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    new_employee_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    performed_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    action: {
      type: DataTypes.ENUM(
        "CREATED",
        "TRANSFERRED",
        "RETURNED",
        "UPDATED",
        "DELETED"
      ),
      allowNull: false,
    },

    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "Backlogs",
    timestamps: true,
  }
);

export default Backlog;