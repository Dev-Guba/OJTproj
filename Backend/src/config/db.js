import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const db_name = process.env.DB_NAME;
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const db_host = process.env.DB_HOST;
const db_port = process.env.DB_PORT || 1433;

const sequelize = new Sequelize(db_name, db_user, db_password, {
  host: db_host,
  port: db_port,
  dialect: "mssql",
  dialectOptions: {
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
  },
  logging: false,
});

export default sequelize;