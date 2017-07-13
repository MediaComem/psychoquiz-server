'use strict';

// File generated with 'sequelize init' and edited with current settings

let path = require('path');
let Sequelize = require('sequelize');
let glob = require('glob-promise');
let basename = path.basename(module.filename);
let db = {};

const forceSync = false; // be careful with this value set to true, it will empty the database when editing the schemas.

let createConfig = state => {
  state.sequelize = new Sequelize(
    state.config.dbname,
    state.config.dbuser,
    state.config.dbpass, {
      host: state.config.dbhost,
      dialect: state.config.dbdialect,
      logging: state.config.dblogging,
      pool: false

    });
  return state;
}


let globFiles = state => {
  return glob(__dirname + "/**/*.model.js")
    .then(contents => {
      state.files = contents;
      return state;
    })
}


let generateModels = state => {
  state.files.forEach(function (f) {
    let DataTypes = Sequelize;
    let model = state.sequelize['import'](f);
    db[model.name] = model;
  });
  return state;
}


let associateDb = state => {
  Object.keys(db).forEach(function (modelName) {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
  return state;
};


let syncSeq = state => {
  state.sequelize.sync({
    force: forceSync
  });
  return state;
};

module.exports = config => {
  return new Promise((resolve, reject) => {
    // All the data passes through `state`
    const state = {
      config: config
    };
    Promise.resolve(state)
      .then(createConfig)
      .then(globFiles)
      .then(generateModels)
      .then(associateDb)
      .then(syncSeq)
      .then(state => {
        db.sequelize = state.sequelize;
        db.Sequelize = Sequelize;
        resolve(db);
      });
  });
};