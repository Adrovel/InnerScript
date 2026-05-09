import { Sequelize } from "sequelize"
import pg from "pg"

import { notes } from "./models/Note.model"
import { folders } from "./models/Folder.model"
import { noteMetadata } from "./models/NoteMetadata.model"

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: false,
  dialect: 'postgres',
  dialectModule: pg,
})

const models = {
  Folders: folders(sequelize),
  Notes: notes(sequelize),
  NoteMetadata: noteMetadata(sequelize),
}

models.Notes.belongsTo(models.Folders, { foreignKey: 'folder_id', as: 'folder' })
models.Folders.hasMany(models.Notes, { foreignKey: 'folder_id', as: 'notes' })
models.Folders.belongsTo(models.Folders, { as: 'parent', foreignKey: 'parent_id' })
models.Folders.hasMany(models.Folders, { as: 'children', foreignKey: 'parent_id' })
models.NoteMetadata.belongsTo(models.Notes, { foreignKey: 'note_id', as: 'note' })
models.Notes.hasOne(models.NoteMetadata, { foreignKey: 'note_id', as: 'metadata' })

async function initDb() {
  try {
    await sequelize.authenticate()
    console.log("Database connection established successfully.")

    await sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    try {
      await sequelize.query('CREATE EXTENSION IF NOT EXISTS vector;')
    } catch (e) {
      console.warn('pgvector not available — semantic search disabled:', e.message)
    }

    await sequelize.sync({ force: false })
    console.log("Database synchronized")

    await sequelize.query(`ALTER TABLE notes ADD COLUMN IF NOT EXISTS embedding vector(1536);`)
    await sequelize.query(`ALTER TABLE note_metadata ADD COLUMN IF NOT EXISTS embedding vector(1536);`)

    // Sequelize's defaultValue is JS-only; set DB-level defaults for raw SQL inserts.
    await sequelize.query(`ALTER TABLE notes ALTER COLUMN id SET DEFAULT uuid_generate_v4();`)
    await sequelize.query(`ALTER TABLE notes ALTER COLUMN "createdAt" SET DEFAULT NOW();`)
    await sequelize.query(`ALTER TABLE notes ALTER COLUMN "updatedAt" SET DEFAULT NOW();`)

    await sequelize.query(`ALTER TABLE folders ALTER COLUMN id SET DEFAULT uuid_generate_v4();`)
    await sequelize.query(`ALTER TABLE folders ALTER COLUMN "createdAt" SET DEFAULT NOW();`)
    await sequelize.query(`ALTER TABLE folders ALTER COLUMN "updatedAt" SET DEFAULT NOW();`)

    await sequelize.query(`ALTER TABLE note_metadata ALTER COLUMN id SET DEFAULT uuid_generate_v4();`)
    await sequelize.query(`ALTER TABLE note_metadata ALTER COLUMN "createdAt" SET DEFAULT NOW();`)
    await sequelize.query(`ALTER TABLE note_metadata ALTER COLUMN "updatedAt" SET DEFAULT NOW();`)

    console.log("Schema ready")
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
