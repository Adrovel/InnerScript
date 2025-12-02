import { Sequelize } from "sequelize"
import pg from "pg"

import { notes } from "./models/Note.model"
import { folders } from "./models/Folder.model"
import { tags } from "./models/Tag.model"
import { noteTags } from "./models/NoteTag.model"

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: false,
  dialect: 'postgres',
  dialectModule: pg,
})

// Initialize models
const models = {
  Folders: folders(sequelize),
  Notes: notes(sequelize),
  Tags: tags(sequelize),
  NoteTags: noteTags(sequelize),
}

models.Notes.belongsTo(models.Folders, { foreignKey: 'folder_id', as: 'folder' })
models.Folders.hasMany(models.Notes, { foreignKey: 'folder_id', as: 'notes' })
models.Folders.belongsTo(models.Folders, { as: 'parent', foreignKey: 'parent_id' })
models.Folders.hasMany(models.Folders, { as: 'children', foreignKey: 'parent_id' })

// Many-to-many associations for tags
models.Notes.belongsToMany(models.Tags, {
  through: models.NoteTags,
  foreignKey: 'note_id',
  otherKey: 'tag_id',
  as: 'tags'
})

models.Tags.belongsToMany(models.Notes, {
  through: models.NoteTags,
  foreignKey: 'tag_id',
  otherKey: 'note_id',
  as: 'notes'
})


// This will create the tables in the DATABASE
// Do not use this in production
// async function initDb() {
//   try {
//     await sequelize.authenticate()
//     console.log("Database connection established successfully.")

//     await sequelize.sync({ alter: true })
//     console.log("Database synchronized")
//   } catch (error) {
//     console.error("Unable to connect to the database:", error)
//   }
// }

// await initDb()

export const db = {
  ...models,
  sequelize,
  Sequelize,
}
