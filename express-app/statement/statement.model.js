"use strict";

module.exports = function (sequelize, DataTypes) {

  // Define fields
  const fields = {
    text: DataTypes.STRING
  };
  // Define Model
  const Statement = sequelize.define("Statement", fields, { });

  Statement.associate = models => {
    Statement.belongsTo(models.Chapter);
    Statement.hasMany(models.Weight);
    Statement.belongsToMany(models.Profile, { through: models.Weight });
  }

  return Statement;

};