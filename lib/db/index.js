import {  Sequelize } from "sequelize"
import pg from "pg"

import { notes } from "./models/Note.model"
import { folders } from "./models/Folder.model"

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: false,
  dialect: 'postgres',
  dialectModule: pg,
})

// Initialize models
const models = {
  Folders: folders(sequelize),
  Notes: notes(sequelize),
}

models.Notes.belongsTo(models.Folders, { foreignKey: 'folder_id', as: 'folder' })
models.Folders.hasMany(models.Notes, { foreignKey: 'folder_id', as: 'notes' })
models.Folders.belongsTo(models.Folders, { as: 'parent', foreignKey: 'parent_id' })
models.Folders.hasMany(models.Folders, { as: 'children', foreignKey: 'parent_id' })


// This will create the tables in the DATABASE
// Do not use this in production
async function initDb() {
  try {
    await sequelize.authenticate()
    console.log("Database connection established successfully.")
    
    // Enable UUID extension
    await sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    
    // This will create the tables in the DATABASE
    // Do not use this in production
    await sequelize.sync({ force: false })
    console.log("Database synchronized")
  } catch (error) {
    console.error("Unable to connect to the database:", error)
  }
}

await initDb()

export const db = {
  ...models,
  sequelize,
  Sequelize,
}
