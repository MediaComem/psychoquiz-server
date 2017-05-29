// Select settings based on NODE_ENV (development or production)
switch (process.env.NODE_ENV) {

  case 'development':
    module.exports = {
      'connectionString': 'mysql://' + process.env.DB_DEV_USER + ':' + process.env.DB_DEV_PASS + '@' + process.env.DB_DEV_HOST + ':3306/' + process.env.DB_DEV_NAME,
      'dbuser':process.env.DB_DEV_USER,
      'dbname':process.env.DB_DEV_NAME,
      'dbpass':process.env.DB_DEV_PASS,
      'dbhost':process.env.DB_DEV_HOST,
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
    module.exports = {
      'connectionString': 'mysql://' + process.env.DB_PROD_USER + ':' + process.env.DB_PROD_PASS + '@' + process.env.DB_PROD_HOST + ':3306/' + process.env.DB_PROD_NAME,
      'dbuser':process.env.DB_PROD_USER,
      'dbname':process.env.DB_PROD_NAME,
      'dbpass':process.env.DB_PROD_PASS,
      'dbhost':process.env.DB_PROD_HOST,
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
    module.exports = {
      'connectionString': 'postgres://' + process.env.DB_DEV_USER + ':' + process.env.DB_DEV_PASS + '@' + process.env.DB_DEV_HOST + ':5432/' + process.env.DB_DEV_NAME,
      'dbuser':process.env.DB_DEV_USER,
      'dbname':process.env.DB_DEV_NAME,
      'dbpass':process.env.DB_DEV_PASS,
      'dbhost':process.env.DB_DEV_HOST,
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
