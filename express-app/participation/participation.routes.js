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
    return promiseFor(count => {
        return count < ans.length;
    }, wer => {
        return req.app.models.Statement.find({
                where: {
                    id: ans[wer].StatementId
                },
                include: req.app.models.Weight
            })
            .then(res => {
                return res.getProfiles().then(profiles => {
                    let answer = {
                        stId: res.id,
                        text: res.text,
                        answer: ans[wer].answer,
                        profiles: getProfilesPerStatement(profiles, ans[wer].answer)
                    }

                    if (profiles.length > 0) {
                        answers.push(answer);
                    }
                    return ++wer;
                });
            });
    }, 0).then(count => {
        return answers;
    });
}

let calculateResultProfiles = answers => {
    let profiles = [];
    for (var i = 0; i < answers.length; i++) {
        for (var j = 0; j < answers[i].profiles.length; j++) {

            for (let k = 0; k < profiles.length; k++) {
                // if it's there
                if (profiles[k].id === answers[i].profiles[j].id) {
                    profiles[k].score = profiles[k].score + answers[i].profiles[j].score;
                }
            }
            // Add id only if not yet there
            let filtered = profiles.filter(el => {
                return el.id === answers[i].profiles[j].id;
            });
            if (filtered.length === 0) {
                profiles.push(answers[i].profiles[j]);
            }
        }
    }
    
    
    return profiles;
}

let getProfilesPerStatement = (profi, answer) => {
    let profiles = [];
    for (var le = 0; le < profi.length; le++) {
        let score = 0;
        if (answer) {
            score = profi[le].Weight.weightIfTrue;
        } else {
            score = profi[le].Weight.weightIfFalse;
        }

        let profile = {
            id: profi[le].id,
            name: profi[le].name,
            description: profi[le].description,
            score: score
        }
        profiles.push(profile);
    }
    return profiles;
}


let getResultsRoute = (rq, rs) => {
    req = rq;
    res = rs;
    return Promise.resolve()
        .then(getParticipationWithToken)
        .then(checkIfParticipationComplete)
        .then(getAnswersAndStatements)
        .then(calculateResultProfiles)
        .then(success)
        .catch(error);
}


let promiseFor = Promise.method(function (condition, action, value) {
    if (!condition(value)) return value;
    return action(value).then(promiseFor.bind(null, condition, action));
});

module.exports = function (app, router) {
    router.post('/api/participations', startGameRoute);
    router.get('/api/participations', getAllParticipationsRoute);
    router.get('/api/participations/:token', getParticipationRoute);
    router.get('/api/participations/:token/results', getResultsRoute);
}