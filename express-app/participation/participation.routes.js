'use strict';
let Promise = require('bluebird');
let uuidBase62 = require('uuid-base62');


let req, res;
let error = error => res.jsend.error(error);
let success = result => res.jsend.success(result);


let getParticipationWithToken = state => {
    return req.app.models.Participation.find({
        where: {
            token: req.params.token
        },
        include: [{
            model: req.app.models.Chapter,
        }, {
            model: req.app.models.Answer,
        }]
    }).then(res => {
        state.participation = res;
    }).return(state);
}

let getParticipationWithCode = state => {
    let token = uuidBase62.decode(req.params.code);

    return req.app.models.Participation.find({
        where: {
            token: token
        },
        include: [{
            model: req.app.models.Chapter,
        }, {
            model: req.app.models.Answer,
        }]
    }).then(res => {
        state.participation = res;
    }).return(state);
}


let getParticipationRoute = (rq, rs) => {
    req = rq;
    res = rs;
    let state = {};
    return Promise.resolve(state)
        .then(getParticipationWithToken)
        .then(state => {
            return state.participation;
        })
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

let checkIfParticipationComplete = state => {
    if (state.participation && state.participation.finished) {
        return state;
    } else {
        throw new Error('Participation not complete');
    }
}


let getAllProfiles = state => {
    return req.app.models.Profile.findAll({
        include: req.app.models.Weight
    }).then(res => {
        state.profiles = res;
    }).return(state);
}


let getAnswersAndStatements = state => {
    const partAnswers = state.participation.Answers;
    let answers = [];
    return promiseFor(count => {
        return count < partAnswers.length;
    }, el => {
        return req.app.models.Statement.find({
                where: {
                    id: partAnswers[el].StatementId
                },
                include: req.app.models.Weight
            })
            .then(statement => {
                
                let answer = {
                    stId: statement.id,
                    text: statement.text,
                    answer: partAnswers[el].answer,
                    updatedProfiles: getProfilesPerStatement(state.profiles, partAnswers[el].answer, statement.id)
                }

                if (state.profiles.length > 0) {
                    answers.push(answer);
                }
                return ++el;
            });
    }, 0).then(count => {
        state.answers = answers;
        return state;
    });
}




let getProfilesPerStatement = (profi, answer, stid) => {
    let profiles = [];    
    for (let le = 0; le < profi.length; le++) {
        let score = 0;
        
        let profileWeights = profi[le].Weights;
        let weightIfTrue = 0;
        let weightIfFalse = 0;
        for (var index = 0; index < profileWeights.length; index++) {
            
            // Corresponding statement id
            if (profileWeights[index].StatementId === stid) {
                weightIfTrue = profileWeights[index].weightIfTrue;
                weightIfFalse = profileWeights[index].weightIfFalse;
            } 
        }
        if (answer) {
            score = weightIfTrue;
        } else {
            // If we answered no
            score = weightIfFalse;
        }

        let max = 0;
        if (weightIfTrue > weightIfFalse) {
            max = weightIfTrue;
        } else {
            max = weightIfFalse;
        }

        let profile = {
            id: profi[le].id,
            name: profi[le].name,
            description: profi[le].description,
            body: profi[le].body,
            score: score,
            total: max
        }
        profiles.push(profile);
    }
    return profiles;
}

let calculateResultProfiles = state => {
    let results = [];

    // For each profile, set a score and a maximum total

    for (let p = 0; p < state.profiles.length; p++) {
        let currentProfile = state.profiles[p];
        let score = 0;
        let total = 0;

        
        for (let i = 0; i < state.answers.length; i++) {
            // one answer has several profiles linked to it
            for (let j = 0; j < state.answers[i].updatedProfiles.length; j++) {
                // push and add the score to the actual results
                if (currentProfile.id === state.answers[i].updatedProfiles[j].id) {
                    score = score + state.answers[i].updatedProfiles[j].score;
                    total = total + state.answers[i].updatedProfiles[j].total;
                }
            }
        }

        let localPercent = 0;
        if (total > 0 && score > 0) {
            localPercent = score / total;
        }
        
        results.push({
            name: currentProfile.name,
            description: currentProfile.description,
            body: currentProfile.body,
            score: score,
            maxScore: total,
            localPercent: localPercent
        });
        // order results by localPercent
        results.sort((a,b) => {return (a.localPercent < b.localPercent) ? 1 : ((b.localPercent < a.localPercent) ? -1 : 0);} ); 
        
    }
    
    // calculate  global results in percentage. Highest is 100%.
    let min = results.reduce(function(el, curr) {
        return el.score < curr.score ? el : curr;
    });

    let max = results.reduce(function(el, curr) {
        return el.score > curr.score ? el : curr;
    });

    let size = max.score - min.score;

    for (var index = 0; index < results.length; index++) {
        var element = results[index];
        element.globalPercent = (element.score - min.score) / size;
    }
    state.results = results;
    return state;
}





let getResultsRoute = (rq, rs) => {
    req = rq;
    res = rs;
    let state = {};
    return Promise.resolve(state)
        .then(getParticipationWithToken)
        .then(checkIfParticipationComplete)
        .then(getAllProfiles)
        .then(getAnswersAndStatements)
        .then(calculateResultProfiles)
        .then(state => {
            return state.results;
        })
        .then(success)
        .catch(error);
}



let getResultsWithShareCodeRoute = (rq, rs) => {
    req = rq;
    res = rs;
    let state = {};
    return Promise.resolve(state)
        .then(getParticipationWithCode)
        .then(checkIfParticipationComplete)
        .then(getAllProfiles)
        .then(getAnswersAndStatements)
        .then(calculateResultProfiles)
        .then(state => {
            return state.results;
        })
        .then(success)
        .catch(error);
}

let getParticipationShareLinkRoute = (rq, rs) => {
    req = rq;
    res = rs;

    return Promise.resolve()
        .then(_ => {
            return uuidBase62.encode(req.params.token);     
        })
        .then(success)
        .catch(error);
}

let promiseFor = Promise.method(function (condition, action, value) {
    if (!condition(value)) return value;
    return action(value).then(promiseFor.bind(null, condition, action));
});

module.exports = function (app, router) {
    router.post('/api/participations', startGameRoute);
    router.get('/api/participations', getAllParticipationsRoute); // TODO: Auth
    router.get('/api/participations/:token', getParticipationRoute);
    router.get('/api/share/:code', getResultsWithShareCodeRoute); // TODO: Remove ?
    router.get('/api/participations/:token/results', getResultsRoute);
    router.get('/api/participations/:token/share', getParticipationShareLinkRoute);
}