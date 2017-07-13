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
    let User = sequelize.define("User", fields, {
        instanceMethods: {
            // Delete password from all the default getters by rewriting toJSON output
            toJSON: function () {
                var values = this.get();
                delete values.hash_password; // encrypted password
                return values;
            },
            comparePassword: function(password) {
                return bcrypt.compareSync(password, this.hash_password);
            }

        }

    });

    return User;
};