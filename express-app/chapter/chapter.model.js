"use strict";

module.exports = function (sequelize, DataTypes) {

  // Define fields
  const fields = {
    title: DataTypes.STRING,
    intro: DataTypes.STRING,
    imgUrl: DataTypes.STRING,
    number: DataTypes.INTEGER
  };
  // Define Model
  const Chapter = sequelize.define("Chapter", fields, { });

  Chapter.associate = function (models) {
    Chapter.hasMany(models.Statement);
    Chapter.belongsToMany(models.Participation, { through: 'ChaptersDone' });
  }
  
  return Chapter;
};