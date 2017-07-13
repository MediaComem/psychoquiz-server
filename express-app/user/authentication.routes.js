'use strict';

let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');

let req, res;
let error = error => res.jsend.error(error);
let success = result => res.jsend.success(result);

let key = process.env.JWT_KEY;


let findUsersByEmail = _ => {
    return req.app.models.User.findAll({
        where: {
            email: req.body.email
        }
    })
}

let testIfNewUser = users => {
    if (users.length > 0) {
        throw new Error('Email already exists in database');
    }
    return users;
}



let createUser = users => {
    let newUser = req.app.models.User.build({
        email: req.body.email,
        hash_password: bcrypt.hashSync(req.body.password, 10)
    });
    return newUser.save();
}

let registerRoute = (rq, rs) => {

    req = rq;
    res = rs;

    return Promise.resolve()
        .then(findUsersByEmail)
        .then(testIfNewUser)
        .then(createUser)
        .then(success)
        .catch(error);

}

let testIfUserExists = users => {
    if (users.length == 0) {
        throw new Error('User not found');
    }
    return users[0];
}


let testPassword = user => {
    if (!user.comparePassword(req.body.password)) {
        throw new Error('Wrong password');
    }
    return user;
}

let generateToken = user => {
    return {
        token: jwt.sign({
            email: user.email,
            id: user.id
        }, key)
    };

}

let loginRoute = (rq, rs) => {
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


module.exports = function (app, router) {
    router.post('/api/auth/login', loginRoute);
    router.post('/api/auth/register', registerRoute);
}