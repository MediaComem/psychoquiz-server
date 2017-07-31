'use strict';


let req, res;
let error = error => res.jsend.error(error);
let success = result => res.jsend.success(result);

let findParticipation = state => {
  return req.app.models.Participation.find({
      where: {
        token: req.body.ParticipationToken
      }
    }).then(participation => state.participation = participation)
    .return(state);
}

let testParticipation = state => {
  if (!state.participation) {
    throw new Error('Participation not found');
  }
  return state;
}

let findStatement = state => {
  return req.app.models.Statement.findById(req.body.StatementId)
    .then(statement => state.statement = statement)
    .return(state);
}

let testStatement = state => {
  if (!state.statement) {
    throw new Error('Statement not found');
  }
  return state;
}

let findOrCreateAnswer = state => {
  return req.app.models.Answer.findOrBuild({
    where: {
      ParticipationId: state.participation.id,
      StatementId: state.statement.id
    }
  })
  .spread((answer, created) => state.answer = answer)
  .return(state);
}

let saveAnswer = state => {
  state.answer.answer = req.body.answer;
  return state.answer.save()
    .return(state);
}

let updateParticipation = state => {
  state.participation.currentChapterId = state.statement.ChapterId;
  return state.participation.save()
    .return(state.answer)
}

let answerRoute = (rq, rs) => {
  req = rq;
  res = rs;
  const state = { };

  return Promise.resolve(state)
    .then(findParticipation)
    .then(testParticipation)
    .then(findStatement)
    .then(testStatement)
    .then(findOrCreateAnswer)
    .then(saveAnswer)
    .then(updateParticipation)
    .then(success)
    .catch(error); // A tester svp
}

module.exports = function (app, router) {
  router.post('/api/answers', answerRoute);
}