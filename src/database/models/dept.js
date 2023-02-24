const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('dept', {
    deptno: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    dname: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    loc: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'dept',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_dept",
        unique: true,
        fields: [
          { name: "deptno" },
        ]
      },
    ]
  });
};
