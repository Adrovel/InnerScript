import { DataTypes } from "sequelize";

export const tags = (sequelize) => {
  return sequelize.define(
    "Tag",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [1, 50]
        }
      },
      slug: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          is: /^[a-z0-9-]+$/i,
        }
      },
      color: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      icon: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      display_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: "tags",
      schema: "public",
      underscored: true,
      indexes: [
        { fields: ['slug'] },
        { fields: ['display_order'] }
      ]
    }
  );
};
