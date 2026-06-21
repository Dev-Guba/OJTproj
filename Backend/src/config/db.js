import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const db_name = process.env.DB_NAME;
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const db_host = process.env.DB_HOST;

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