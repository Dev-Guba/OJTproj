import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Record = sequelize.define(
  "ICTORecords",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    article: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },

    propNumber: { type: DataTypes.STRING, allowNull: false },
    dateAcquired: { type: DataTypes.DATEONLY, allowNull: false },

    unit: { type: DataTypes.STRING, allowNull: true },
    unitValue: { type: DataTypes.DECIMAL(18, 2), allowNull: true },

    balQty: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    balValue: { type: DataTypes.DECIMAL(18, 2), allowNull: true },

    accountableOfficer: { type: DataTypes.STRING, allowNull: false },
    areMeNo: { type: DataTypes.STRING, allowNull: true },
    office: { type: DataTypes.STRING, allowNull: true },
  },
  {
    timestamps: true,
  }
);

export default Record;