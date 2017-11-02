'use strict';

let Promise = require('bluebird');

let req, res;

const path = require("path");

const dir = path.join(__dirname + '/')

/**
 *  Route definitions
 */

module.exports = function (app, router) {


  const shareRoute = (rq, rs) => {
    req = rq;
    res = rs;
    return Promise.resolve()
      .then(_ => {
        res.sendFile(dir + req.params.profile + '.html');
      });

  }

  router.get('/api/shareHtml/:profile', shareRoute);

}