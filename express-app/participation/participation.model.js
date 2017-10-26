"use strict";

module.exports = function (sequelize, DataTypes) {

  // Define fields
  const fields = {
    token: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1
    },
    finished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
    
  };
  // Define Model
  const Participation = sequelize.define("Participation", fields, { });

  Participation.associate = models => {
    Participation.hasMany(models.Answer);
    Participation.belongsToMany(models.Chapter, { through: 'ChaptersDone' });
  }

  return Participation;
  
};