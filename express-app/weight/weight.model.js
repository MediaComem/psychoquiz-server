"use strict";

module.exports = function (sequelize, DataTypes) {

  // Define fields
  let fields = {
    weightIfTrue: DataTypes.INTEGER,
    weightIfFalse: DataTypes.INTEGER
  };
  // Define Model
  let Weight = sequelize.define("Weight", fields, {
    classMethods: {
      associate: function (models) {
        Weight.belongsTo(models.Profile, {
          foreignKey: "ProfileId"
        });
        Weight.belongsTo(models.Statement, {
          foreignKey: "StatementId"
        });
      }
    }
  });

  return Weight;

};