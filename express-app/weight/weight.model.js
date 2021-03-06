"use strict";

module.exports = function (sequelize, DataTypes) {

  // Define fields
  const fields = {
    weightIfTrue: DataTypes.INTEGER,
    weightIfFalse: DataTypes.INTEGER,
    ProfileId: DataTypes.INTEGER,
    StatementId: DataTypes.INTEGER
  };
  // Define Model
  const Weight = sequelize.define("Weight", fields, {
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

  Weight.associate = models => {
    Weight.belongsTo(models.Profile, {
      foreignKey: "ProfileId"
    });
    Weight.belongsTo(models.Statement, {
      foreignKey: "StatementId"
    });
  }

  return Weight;

};