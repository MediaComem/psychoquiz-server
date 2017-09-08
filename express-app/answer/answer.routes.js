'use strict';


let req, res;
let error = error => res.jsend.error(error);
let success = result => res.jsend.success(result);

let findParticipation = state => {
  if (!req.query.pt) {
    throw new Error('Participation token missing');
  }
  return req.app.models.Participation.find({
      where: {
        token: req.query.pt
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

let getCurrentChapter = state => {
  return state.statement.getChapter()
    .then(chapter => {
      state.currentChapter = chapter;
    })
    .return(state);
}
let getAllStatementsForChapter = state => {
    
    return state.currentChapter.getStatements().then(res => {
      // getting the number of total statements
      state.allStatements = res;

    }).return(state);
}

// getting the number of answered statements
let findAnsweredStatements = state => {
  return req.app.models.Answer.findAll({
    where: {
      ParticipationId : state.participation.id
    }
  }).then(answers => {
    state.answeredStatements = [];
    for (var index = 0; index < answers.length; index++) {
      state.answeredStatements.push(answers[index].StatementId);
    }
    return state;
  });
}

let checkIfChapterIsComplete = state => {
  state.statementsLeft = state.allStatements.filter(el => {
    return state.answeredStatements.indexOf(el.id) < 0; // statements left (nothing here ?)
  });
  return state;
}
let updateParticipation = state => {
  if (state.statementsLeft.length === 0) {
    return state.participation.getChapters().then(chapters => {
      chapters.push(state.currentChapter);
      return state.participation.setChapters(chapters)
        .then(res => {
          state.participation.finished = true;
          return state.participation.save()
            .return(state.answer);
        });
    });
  }
  return state.answer;
}

let answerRoute = (rq, rs) => {
  req = rq;
  res = rs;
  const state = {};

  return Promise.resolve(state)
    .then(findParticipation)
    .then(testParticipation)
    .then(findStatement)
    .then(testStatement)
    .then(findOrCreateAnswer)
    .then(saveAnswer)
    .then(getCurrentChapter)
    .then(getAllStatementsForChapter)
    .then(findAnsweredStatements)
    .then(checkIfChapterIsComplete)
    .then(updateParticipation)
    .then(success)
    .catch(error);
}

module.exports = function (app, router) {
  router.post('/api/answers', answerRoute);
}