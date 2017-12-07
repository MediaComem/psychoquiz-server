'use strict';

const bcrypt = require('bcrypt');
const debug = require('debug')('psychoquiz:auth');
const jsonwebtoken = require('jsonwebtoken');

let req, res;
const error = error => res.jsend.error(error);
const success = result => res.jsend.success(result);

const key = process.env.JWT_KEY;


const findUsersByEmail = _ => {
    return req.app.models.User.findAll({
        where: {
            email: req.body.email
        }
    })
}

const testIfNewUser = users => {
    if (users.length > 0) {
        throw new Error('Email already exists in database');
    }
    return users;
}



const createUser = users => {
    const newUser = req.app.models.User.build({
        email: req.body.email,
        hash_password: bcrypt.hashSync(req.body.password, 10)
    });
    return newUser.save();
}

const registerRoute = (rq, rs) => {

    req = rq;
    res = rs;

    return Promise.resolve()
        .then(findUsersByEmail)
        .then(testIfNewUser)
        .then(createUser)
        .then(success)
        .catch(error);

}

const testIfUserExists = users => {
    if (users.length == 0) {
        throw new Error('User not found');
    }
    return users[0];
}


const testPassword = user => {
    if (!user.comparePassword(req.body.password)) {
        throw new Error('Wrong password');
    }
    return user;
}

const generateToken = user => {
    return {
        token: jsonwebtoken.sign({
            email: user.email,
            id: user.id // TODO: Expires
        }, key)
    };

}

const loginRoute = (rq, rs) => {
    req = rq;
    res = rs;
    return Promise.resolve()
        .then(findUsersByEmail)
        .then(testIfUserExists)
        .then(testPassword)
        .then(generateToken)
        .then(success)
        .catch(error)
}

/*let checkUserRoute = (rq, rs) => {
    req = rq;
    res = rs;
    return Promise.resolve()
        .then() // TODO
        .then(success)
        .catch(error)
}*/


module.exports = function (app, router) {
  router.post('/api/auth/login', loginRoute);
  //router.get('/api/auth/user', checkUserRoute);

  if (app.config.adminEnabled) {
    debug('Registration API enabled');
    router.post('/api/auth/register', registerRoute); // TODO: Auth
  } else {
    debug('Registration API disabled');
  }
}
