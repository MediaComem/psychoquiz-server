"use strict";

module.exports = function (sequelize, DataTypes) {

  // Define fields
  let fields = {
    title: DataTypes.STRING,
    intro: DataTypes.STRING,
    imgUrl: DataTypes.STRING,
    number: DataTypes.INTEGER
  };
  // Define Model
  let Chapter = sequelize.define("Chapter", fields, {
    classMethods: {
      associate: function (models) {
        Chapter.hasMany(models.Statement);
        Chapter.belongsToMany(models.Participation, { through: 'ChaptersDone' });
      }
    }
  });
  
  return Chapter;
};