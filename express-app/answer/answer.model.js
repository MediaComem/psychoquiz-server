"use strict";

module.exports = function (sequelize, DataTypes) {

  // Define fields
  let fields = {
    answer: DataTypes.BOOLEAN
  };
  // Define Model
  let Answer = sequelize.define("Answer", fields, {
    classMethods: {
      associate: function (models) {
        Answer.belongsTo(models.Participation);
        Answer.belongsTo(models.Statement);
      }
    }
  });
  
  return Answer;
};