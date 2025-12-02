import { DataTypes } from "sequelize";

export const noteTags = (sequelize) => {
  return sequelize.define(
    "NoteTag",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
      },
      note_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'notes',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      tag_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'tags',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
    },
    {
      timestamps: true,
      tableName: "note_tags",
      schema: "public",
      underscored: true,
      indexes: [
        { fields: ['note_id'] },
        { fields: ['tag_id'] },
        {
          fields: ['note_id', 'tag_id'],
          unique: true,
          name: 'unique_note_tag'
        }
      ]
    }
  );
};
