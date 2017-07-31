'use strict';


let req, res;
let error = error => res.jsend.error(error);
let success = result => res.jsend.success(result);


let getParticipationWithToken = _ => {
    return req.app.models.Participation.find({
        where: {
            token: req.params.token
        },
        include: [{
            model: req.app.models.Chapter,
        }, {
            model: req.app.models.Answer,
        }]
    });
}


let getParticipationRoute = (rq, rs) => {
    req = rq;
    res = rs;
    return Promise.resolve()
        .then(getParticipationWithToken)
        .then(success)
        .catch(error);
}

let getAllParticipations = _ => {
    return req.app.models.Participation.findAll({
        include: [{
            model: req.app.models.Answer,
        }
    ]
    });
}

let getAllParticipationsRoute = (rq, rs) => {
    req = rq;
    res = rs;
    return Promise.resolve()
        .then(getAllParticipations)
        .then(success)
        .catch(error);
}


let createParticipation = _ => {
    let newParticipation = req.app.models.Participation.build({
        token: req.body.token
    });
    return newParticipation.save();
}

let startGameRoute = (rq, rs) => {
    req = rq;
    res = rs;
    return Promise.resolve()
        .then(createParticipation)
        .then(success)
        .catch(error);
}

module.exports = function (app, router) {
    router.post('/api/participations', startGameRoute);
    router.get('/api/participations', getAllParticipationsRoute);
    router.get('/api/participations/:token', getParticipationRoute);
}