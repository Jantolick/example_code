const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tmp_counter', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tmp_counter',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "tmp_counter_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
