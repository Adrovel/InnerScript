import { DataTypes } from "sequelize";

export const folders = (sequelize) => {
  return sequelize.define(
    "Folder",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      parent_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      tableName: "folders",
      schema: "public",
    },
  );
};
