"use strict";

module.exports = function (sequelize, DataTypes) {

  // Define fields
  let fields = {
    text: DataTypes.STRING
  };
  // Define Model
  let Statement = sequelize.define("Statement", fields, {
    classMethods: {
      associate: function (models) {
        Statement.belongsTo(models.Chapter);
        Statement.hasMany(models.Weight);
      }
    }
  });

  return Statement;

};