// Select settings based on NODE_ENV (development or production)
let config = {};
switch (process.env.NODE_ENV) {
  case 'development':
    config = {
      'connectionString': 'mysql://' + process.env.DB_DEV_USER + ':' + process.env.DB_DEV_PASS + '@' + process.env.DB_DEV_HOST + ':3306/' + process.env.DB_DEV_NAME,
      'dbuser': process.env.DB_DEV_USER,
      'dbname': process.env.DB_DEV_NAME,
      'dbpass': process.env.DB_DEV_PASS,
      'dbhost': process.env.DB_DEV_HOST,
      'dbdialect': 'mysql',
      'dblogging': false,
      'secret': 'g0jewpddfadsakjlknvlkjlkwj',
      'port': 8090,
      'nodemailer': {
        host: process.env.MAIL_DEV_HOST,
        port: process.env.MAIL_DEV_PORT,
        secure: process.env.MAIL_DEV_SECURE, // use SSL
        auth: {
          user: process.env.MAIL_DEV_AUTH_USER,
          pass: process.env.MAIL_DEV_AUTH_PASS
        }
      }
    };
    break;
  case 'production':
    config = {
      'connectionString': 'mysql://' + process.env.DB_PROD_USER + ':' + process.env.DB_PROD_PASS + '@' + process.env.DB_PROD_HOST + ':3306/' + process.env.DB_PROD_NAME,
      'dbuser': process.env.DB_PROD_USER,
      'dbname': process.env.DB_PROD_NAME,
      'dbpass': process.env.DB_PROD_PASS,
      'dbhost': process.env.DB_PROD_HOST,
      'dbdialect': 'mysql',
      'dblogging': false,
      'secret': 'fh8f08hew09wj2223gfsddve',
      'port': 8089,
      'nodemailer': {
        host: process.env.MAIL_PROD_HOST,
        port: process.env.MAIL_PROD_PORT,
        secure: process.env.MAIL_PROD_SECURE, // use SSL ?
        auth: {
          user: process.env.MAIL_PROD_AUTH_USER,
          pass: process.env.MAIL_PROD_AUTH_PASS
        }
      }
    };
    break;
  default:
    config = {
      'connectionString': 'postgres://' + process.env.DB_DEV_USER + ':' + process.env.DB_DEV_PASS + '@' + process.env.DB_DEV_HOST + ':5432/' + process.env.DB_DEV_NAME,
      'dbuser': process.env.DB_DEV_USER,
      'dbname': process.env.DB_DEV_NAME,
      'dbpass': process.env.DB_DEV_PASS,
      'dbhost': process.env.DB_DEV_HOST,
      'dbdialect': 'postgres',
      'dblogging': false,
      'secret': '98je09kj34aowqoie',
      'port': 8090,
      'nodemailer': {
        host: process.env.MAIL_DEV_HOST,
        port: process.env.MAIL_DEV_PORT,
        secure: process.env.MAIL_DEV_SECURE, // use SSL
        auth: {
          user: process.env.MAIL_DEV_AUTH_USER,
          pass: process.env.MAIL_DEV_AUTH_PASS
        }
      }
    }
}

// Adding static users to .env files.
// The env file should have a USER_LOGIN key (for example USER_ADMIN or USER_JOHN) associated with a BCRYPT encrypted password

config.users = [];
Object.keys(process.env).some((k) => {
  // FIXME: add a prefix to this environment variable
  if (k.indexOf("USER_") === 0) {
    try {
      let login = k.split('_')[1].toLowerCase();
      if (login.length<1) {
        throw new Error('invalid user '+k+' in .env file');
      }
      config.users.push({
        login: login,
        password: process.env[k]
      })
    } catch (error) {
      console.warn(error);
    }
  }
})
module.exports = config;
