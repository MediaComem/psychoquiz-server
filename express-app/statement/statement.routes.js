'use strict';
const Promise = require('bluebird');
const debug = require('debug')('psychoquiz:statements');

let req, res;
let error = error => res.jsend.error(error);
let success = result => res.jsend.success(result);


/**
 * Get all statements
 */
let getStatements = _ => {
  return req.app.models.Statement.findAll({ order: [
    ['ChapterId', 'ASC']
  ]});
}

let getStatementsRoute = (rq, rs) => {
  req = rq;
  res = rs; // closures \o/
  return Promise.resolve()
    .then(getStatements)
    .then(success)
    .catch(error);
}

/**
 * Get a specific statement
 */

let findStatementById = state => {
  return req.app.models.Statement.findOne({
    where: {
      id: req.params.id
    },
    include: [req.app.models.Profile]
  }).then(res => {
    state.statement = res;
  }).return(state);
}

let testStatement = state => {
  if (!state.statement) {
    throw new Error('Statement not found');
  }
  return state;
}

let getStatementByIdRoute = (rq, rs) => {
  req = rq;
  res = rs;
  let state = {};
  return Promise.resolve(state)
    .then(findStatementById)
    .then(testStatement)
    .then(st => {
      return st.statement;
    })
    .then(success)
    .catch(error);
}

/**
 * Get and test chapter to attach the statement to.
 */

let findChapterById = state => {
  return req.app.models.Chapter.findById(req.body.ChapterId)
    .then(chap => {
      state.chapter = chap;
    })
    .return(state);
}

let testChapter = state => {
  if (!state.chapter) {
    throw new Error('Chapter not found');
  }
  return state;
}

/**
 * Create a new statement
 */

let createStatement = state => {
  let newStatement = req.app.models.Statement.build({
    text: req.body.text,
    ChapterId: state.chapter.id
  });

  return newStatement.save().then(statement => {
    state.statement = statement;
  }).return(state);
}

let linkStatement = state => {
  if (req.body.profiles) {
    let profi = req.body.profiles;    
    return promiseFor(count => {
      return count < profi.length;
    }, le => {
      return createWeight(profi[le], state.statement.id)
        .then(res => {
          return ++le;
        });
    }, 0).then(count => {
      state.count = count;
    }).return(state);
  }
  return state;
}


let createWeight = (profile, stid) => {
  let weightConditions = {
    ProfileId: profile.id,
    StatementId: stid
  }
  let weightValues = {
    weightIfTrue: profile.true,
    weightIfFalse: profile.false,
    ProfileId: profile.id,
    StatementId: stid
  };

  return upsertWeight(weightValues, weightConditions);
}


let upsertWeight = (values, condition) => {
  return req.app.models.Weight
    .findOne({
      where: condition
    })
    .then(function (obj) {
      if (obj) { // update
        return obj.update(values);
      } else { // insert
        return req.app.models.Weight.create(values);
      }
    });
}

let createStatementRoute = (rq, rs) => {
  req = rq;
  res = rs;
  let state = {};
  return Promise.resolve(state)
    .then(findChapterById)
    .then(testChapter)
    .then(createStatement)
    .then(linkStatement)
    .then(state => {
      return state.statement;
    })
    .then(success)
    .catch(error);
}



/**
 * Update a specific statement
 */
let updateStatement = state => {
  state.statement.text = req.body.text || state.statement.text;
  state.statement.ChapterId = req.body.ChapterId || state.statement.ChapterId;
  return state.statement.save()
    .return(state);
}

let updateStatementRoute = (rq, rs) => {

  req = rq;
  res = rs;
  let state = {};
  return Promise.resolve(state)
    .then(findStatementById)
    .then(testStatement)
    .then(findChapterById)
    .then(testChapter)
    .then(updateStatement)
    .then(linkStatement)
    // reload the statement to have the links (this is dirty...)
    .then(findStatementById)
    .then(state => {
      return state.statement;
    })
    .then(success)
    .catch(error);
}


/**
 * Delete a statement
 */

let deleteStatement = state => {
  return state.statement.destroy();
}

let deleteStatementRoute = (rq, rs) => {
  req = rq;
  res = rs;
  let state = {};
  return Promise.resolve(state)
    .then(findStatementById)
    .then(testStatement)
    .then(deleteStatement)
    .then(success)
    .catch(error);
}

let promiseFor = Promise.method(function (condition, action, value) {
  if (!condition(value)) return value;
  return action(value).then(promiseFor.bind(null, condition, action));
});

/**
 *  Route definitions
 */

module.exports = function (app, router) {
  if (app.config.adminEnabled) {
    debug('Statements admin API enabled');
    router.get('/api/statements', getStatementsRoute);
    router.post('/api/statements', createStatementRoute);
    router.get('/api/statements/:id', getStatementByIdRoute);
    router.put('/api/statements/:id', updateStatementRoute);
    router.delete('/api/statements/:id', deleteStatementRoute);
  } else {
    debug('Statements admin API disabled');
  }
}
