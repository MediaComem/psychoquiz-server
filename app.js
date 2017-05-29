'use strict';

global.include = function (name) {
  return require(__dirname + '/' + name);
};

// vendor resources
let express       = require('express');
let mysql         = require('mysql');
let bodyParser    = require('body-parser');
let trycatch      = require('trycatch');
let jsend         = require('jsend');
let nodemailer    = require('nodemailer');
let smtpTransport = require("nodemailer-smtp-transport");

// get router instance
let router        = express.Router();

// get express singleton instance
let app = express();


// use .env files as configuration files
require('dotenv').config();
// attach config to app object
app.config = require('./config');

// attach models to app object and test database connection
require('./express-app/models')(app.config).then(seq => {

  app.models = seq;
  // attach and configure nodemailer transporter
  app.transporter = nodemailer
    .createTransport('smtp://' +
      app.config.nodemailer.auth.user +
      ':' + app.config.nodemailer.auth.pass +
      '@' + app.config.nodemailer.host
    );


  // generated documentation folder can be statically used
  app.use('/doc', express.static(__dirname + '/doc'));

  // setup global middlewares
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  // Allow use of jsend response type (https://github.com/Prestaul/jsend)
  app.use(jsend.middleware);


  // Set up default headers
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

  app.use('/', router);


  /**
   * Start listening.
   */
  let server = app.listen(app.config.port, () => {

    console.log(
      'Running in NODE_ENV: ' + process.env.NODE_ENV + ' \n' +
      'Listening on port: ' + app.config.port + ' \n'
    );
  });

  app.io = require('socket.io')(server);


  /**
   * API routes
   */

   require('./express-app/routing')(app, router);

  /**
   * 404 route.
   */
  /*router.all('*', function (req, res) {
    res.jsend.error('Page not found');
  });*/

// Database connexion fail
}).catch((error) => {
  console.warn('Could not start app, database connection error');
  console.log(error);
  process.exit(1);
});
