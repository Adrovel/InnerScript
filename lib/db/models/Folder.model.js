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
        validate: {
          nonEmpty: true,
          len: [1, 255]
        }
      },
      parent_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references
      },
    },
    {
      timestamps: true,
      tableName: "folders",
      schema: "public",
    },
  );
};
