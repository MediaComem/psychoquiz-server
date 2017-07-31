"use strict";

module.exports = function (sequelize, DataTypes) {

  // Define fields
  let fields = {
    token: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1
    },
    currentChapterId: DataTypes.INTEGER,
    finished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  };
  // Define Model
  let Participation = sequelize.define("Participation", fields, {
    classMethods: {
      associate: function (models) {
        Participation.hasMany(models.Answer);
        Participation.belongsTo(models.Chapter, {
          foreignKey: 'currentChapterId'
        });
      }
    }
  });

  return Participation;
};