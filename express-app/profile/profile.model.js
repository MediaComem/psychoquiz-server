"use strict";

module.exports = function (sequelize, DataTypes) {

  // Define fields
  const fields = {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    body: DataTypes.TEXT('long')
  };
  // Define Model
  const Profile = sequelize.define("Profile", fields, { });

  Profile.associate = models => {
    Profile.hasMany(models.Weight);
  }

  return Profile;


};