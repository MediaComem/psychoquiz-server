"use strict";

module.exports = function (sequelize, DataTypes) {

  // Define fields
  const fields = {
    answer: DataTypes.BOOLEAN
  };
  // Define Model
  const Answer = sequelize.define("Answer", fields, {});

  Answer.associate = models => {
    Answer.belongsTo(models.Participation);
    Answer.belongsTo(models.Statement);
  }
  
  return Answer;
};