import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Record = sequelize.define(
  "ICTORecords",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // Employee owner
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // Asset reference
    article_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    areMeNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    office: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    status: {
      type: DataTypes.STRING,
      allowNull:false,
      defaultValue:"ISSUED"
    },

    issuedDate:{
      type:DataTypes.DATEONLY,
      allowNull:true
    },

    returnedDate:{
      type:DataTypes.DATEONLY,
      allowNull:true
    }

  },
  {
    tableName:"ICTORecords",
    timestamps:true,
  }
);

export default Record;