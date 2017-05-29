"use strict";

module.exports = function (sequelize, DataTypes) {

  // Define fields
  let fields = {
    intro: DataTypes.STRING,
    imgUrl: DataTypes.STRING
  };
  // Define Model
  let Chapter = sequelize.define("Chapter", fields, {
    classMethods: {
      associate: function (models) {
        Chapter.hasMany(models.Statement);
      }
    }
  });
  
  return Chapter;
};