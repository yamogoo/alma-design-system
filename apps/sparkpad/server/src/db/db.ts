import { Sequelize } from "@sequelize/core";
import { SqliteDialect } from "@sequelize/sqlite3";

export const sequelize = new Sequelize({
  dialect: SqliteDialect,
  storage: "./database.sqlite",
});
