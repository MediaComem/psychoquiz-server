"use strict";

module.exports = function (sequelize, DataTypes) {

  // Define fields
  let fields = {
    date: DataTypes.DATE,
    token: DataTypes.STRING,
    finished: DataTypes.BOOLEAN
  };
  // Define Model
  let Participation = sequelize.define("Participation", fields, {
    classMethods: {
      associate: function (models) {
        Participation.hasMany(models.Answer);
        Participation.belongsTo(models.Chapter, {foreignKey: 'currentChapterId'});
      }
    }
  });
  
  return Participation;
};