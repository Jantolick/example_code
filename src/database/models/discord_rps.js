const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('discord_rps', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    initiator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'discord_users',
        key: 'id'
      }
    },
    challenge_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    challenge_choice: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'discord_rps_choices',
        key: 'id'
      }
    },
    challenge_target_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'discord_users',
        key: 'id'
      }
    },
    initiator_choice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'discord_rps_choices',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'discord_rps',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "discord_rps_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
