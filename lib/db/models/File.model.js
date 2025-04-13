import { DataTypes } from "sequelize";

export const files = (sequelize) => {
  return sequelize.define(
    "File",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      // folder_id: {
      //   type: DataTypes.UUID,
      //   allowNull: false,
      // },
    },
    {
      timestamps: true,
      tableName: "files",
      schema: "public",
    },
  );
};
