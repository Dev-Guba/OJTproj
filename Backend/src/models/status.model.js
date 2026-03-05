import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const Status = sequelize.define(
    "CPTStatus", {
        statusId : {
        type : sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      statusCode : {
        type: sequelize.STRING(50),
        allowNull: false
      },

      statusDesc : {
        typle : sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
    },
    {
        timestamps: false
    }
)

export default Status;