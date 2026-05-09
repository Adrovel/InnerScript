import { DataTypes } from "sequelize"

export const noteMetadata = (sequelize) => {
  return sequelize.define(
    "NoteMetadata",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      note_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      mood_score: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      arousal: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      emotion_label: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      topics: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      summary: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      da_reflection: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      analysed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      tableName: "note_metadata",
      schema: "public",
    }
  )
}
