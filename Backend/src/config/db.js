import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const db_name = process.env.IVAN_DB_NAME;
const db_user = process.env.IVAN_DB_USER;
const db_password = process.env.IVAN_DB_PASSWORD;
const db_host = process.env.IVAN_DB_HOST;

const sequelize = new Sequelize(
  db_name,
  db_user,
  db_password,
  {
    host: db_host,
    dialect: "mssql",
    dialectOptions: {
      options: {
        encrypt: true,
        trustServerCertificate: true,
      },
    },
    logging: false,
  }
);

export default sequelize;