import { Sequelize } from "sequelize";

const DB_NAME = process.env.DB_NAME || "";
const DB_USERNAME = process.env.DB_USERNAME || "";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_HOST = process.env.DB_HOST || "";

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
  define: { freezeTableName: true, underscored: true },
});

export default sequelize;
