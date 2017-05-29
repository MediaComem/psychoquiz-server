'use strict';

// File generated with 'sequelize init' and edited with current settings

let path = require('path');
let Sequelize = require('sequelize');
let basename = path.basename(module.filename);
let db = {};
var glob = require("glob")

// options is optional


module.exports = function (config) {
  var sequelize = new Sequelize(
    config.dbname,
    config.dbuser,
    config.dbpass, {
      host: config.dbhost,
      dialect: config.dbdialect,
      logging: config.dblogging,
      pool: false

    });

  return new Promise(function (resolve, reject) {
    let loadFiles = _ => {
      glob(__dirname + "/**/*.model.js", (er, files) => {
        
        generateModels(files);

        Object.keys(db).forEach(function (modelName) {
          //console.log(modelName);
          if (db[modelName].associate) {
            db[modelName].associate(db);
          }
        });

        // Sync and return DB
        return sequelize.sync({ force: true }).then(() => {
          db.sequelize = sequelize;
          db.Sequelize = Sequelize;
          resolve(db);
        })
      })
    }

    let generateModels = (files) => {
      files.forEach(function (file) {

        let DataTypes = Sequelize;
        let model = sequelize['import'](file);
        db[model.name] = model;

      });
    }

    sequelize.authenticate()
      .then(() => {
        loadFiles()
      });

  });
}