"use strict";

module.exports = function (sequelize, DataTypes) {

  // Define fields
  let fields = {
    name: DataTypes.STRING,
    description: DataTypes.STRING
  };
  // Define Model
  let Profile = sequelize.define("Profile", fields, {
    classMethods: {
      associate: function (models) {
        Profile.hasMany(models.Weight);
      }
    }
  });

  return Profile;


};