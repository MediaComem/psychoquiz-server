"use strict";

module.exports = function (sequelize, DataTypes) {

  // Define fields
  let fields = {
    intro: DataTypes.STRING,
    imgUrl: DataTypes.STRING
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