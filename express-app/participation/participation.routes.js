'use strict';
let Promise = require('bluebird');

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
        }]
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
    let newParticipation = req.app.models.Participation.build();
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

let checkIfParticipationComplete = participation => {
    if (participation.finished) {
        return participation;
    } else {
        throw new Error('Participation not complete');
    }
}



let getAnswersAndStatements = participation => {
    const ans = participation.Answers;
    let answers = [];
    return promiseFor(function (i) {
        return i < ans.length;
    }, function (wer) {
        return req.app.models.Statement.find({
                where: {
                    id: ans[wer].StatementId
                },
                include: req.app.models.Weight
            })
            .then(function (res) {
                return res.getProfiles().then(profiles => {
                    let answer = {
                        stId: res.id,
                        text: res.text,
                        answer: ans[wer].answer,
                        weights: res.Weights,
                        profiles: profiles
                    }
                    answers.push(answer);
                    return ++wer;
                });
            });
    }, 0).then(res => {
        return answers;

    });

}


let promiseFor = Promise.method(function (condition, action, value) {
    if (!condition(value)) return value;
    return action(value).then(promiseFor.bind(null, condition, action));
});



let getResultsRoute = (rq, rs) => {
    req = rq;
    res = rs;
    return Promise.resolve()
        .then(getParticipationWithToken)
        .then(checkIfParticipationComplete)
        .then(getAnswersAndStatements)
        .then(success)
        .catch(error);
}

module.exports = function (app, router) {
    router.post('/api/participations', startGameRoute);
    router.get('/api/participations', getAllParticipationsRoute);
    router.get('/api/participations/:token', getParticipationRoute);
    router.get('/api/participations/:token/results', getResultsRoute);
}