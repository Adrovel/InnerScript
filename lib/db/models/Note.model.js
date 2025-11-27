import { DataTypes } from "sequelize";

export const notes = (sequelize) => {
  return sequelize.define(
    "Note",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      content_json: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      folder_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      tableName: "notes",
      schema: "public",
    },
  );
};
