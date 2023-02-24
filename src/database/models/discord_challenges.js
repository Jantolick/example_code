const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "discord_challenges",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      challenge_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "discord_users",
          key: "id",
        },
      },
      last_challenge_notice: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      end_date: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "discord_challenges",
      schema: "public",
      timestamps: false,
      indexes: [
        {
          name: "discord_challenges_pkey",
          unique: true,
          fields: [{ name: "id" }],
        },
      ],
    }
  );
};
