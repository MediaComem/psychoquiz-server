"use strict";

let bcrypt = require('bcrypt');
module.exports = function (sequelize, DataTypes) {

    // Define fields
    let fields = {
        email: DataTypes.STRING,
        hash_password: DataTypes.STRING,
        role: DataTypes.STRING
    };
    // Define Model
    let User = sequelize.define("User", fields, {});

    User.prototype.toJSON = function() {
        var values = this.get();
        delete values.hash_password; // encrypted password
        return values;
    };

    User.prototype.comparePassword = function(password) {
        return bcrypt.compareSync(password, this.hash_password);
    };

    return User;
};
