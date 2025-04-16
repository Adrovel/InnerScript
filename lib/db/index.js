import {  Sequelize } from "sequelize";

import { files } from "./models/File.model";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: false,
});

const models = {
  File: files(sequelize),
};

// This will create the tables in the DATABASE
// Do not use this in production
sequelize.sync({ force: false });

export const db = {
  ...models,
  sequelize,
  Sequelize,
};
