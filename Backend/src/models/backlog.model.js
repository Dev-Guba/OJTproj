import { DataTypes } from "sequelize";
import sequelize from "../config/db.js"; // adjust path to match your project

const Backlog = sequelize.define("Backlog", {
  tracking_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  records_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Created"
  }
}, {
  tableName: "Backlogs",
  timestamps: true
});

export default Backlog;