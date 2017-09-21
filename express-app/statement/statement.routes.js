'use strict';

let Promise = require('bluebird');

let req, res;
let error = error => res.jsend.error(error);
let success = result => res.jsend.success(result);


/**
 * Get all statements
 */
let getStatements = _ => {
  return req.app.models.Statement.findAll();
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

let findStatementById = _ => {
  return req.app.models.Statement.findById(req.params.id);
}

let testStatement = statement => {
  if (!statement) {
    throw new Error('Statement not found');
  }
  return statement;
}

let getStatementByIdRoute = (rq, rs) => {
  req = rq;
  res = rs;
  return Promise.resolve()
    .then(findStatementById)
    .then(testStatement)
    .then(success)
    .catch(error);
}

/**
 * Get and test chapter to attach the statement to.
 */

let findChapterById = _ => {
  return req.app.models.Chapter.findById(req.body.ChapterId);
}

let testChapter = chapter => {
  if (!chapter) {
    throw new Error('Chapter not found');
  }
  return chapter;
}

/**
 * Create a new statement
 */

let createStatement = chapter => {
  let newStatement = req.app.models.Statement.build({
    text: req.body.text,
    ChapterId: chapter.id
  });
  return newStatement.save();
}

let linkStatement = statement => {
  let profi = req.body.profiles;
  
  return promiseFor(count => {
    return count < profi.length;
  }, le => {
    return createWeight(profi[le], statement.id)
      .then(res => {
        console.log(res);
        return ++le;
      });
  }, 0).then(count => {
    return statement;
  });
 
}


let createWeight = (profile, stid) => {
  let findWeight = req.app.models.Weight.findAll({
    where: {
      ProfileId: profile.id,
      StatementId: stid
    }
  }).then(res => {
    if (res.length > 1) {
      throw new Error('Profile and Statement already have a weight');
    }
  })
  let newWeight = req.app.models.Weight.build({
    weightIfTrue: profile.true,
    weightIfFalse: profile.false,
    ProfileId: profile.id,
    StatementId: stid
  });
  return newWeight.save();
}

let createStatementRoute = (rq, rs) => {
  req = rq;
  res = rs;
  return Promise.resolve()
    .then(findChapterById)
    .then(testChapter)
    .then(createStatement)
    .then(linkStatement)
    .then(success)
    .catch(error); // A tester svp
}

/**
 * Update a specific statement
 */
let updateStatement = statement => {
  statement.text = req.body.text || statement.text;
  statement.ChapterId = req.body.ChapterId || statement.ChapterId;
  return statement.save();
}

let updateStatementRoute = (rq, rs) => {
  req = rq;
  res = rs;
  return Promise.resolve()
    .then(findStatementById)
    .then(testStatement)
    .then(findChapterById)
    .then(testChapter)
    .then(updateStatement)
    .then(success)
    .catch(error);
}


/**
 * Delete a statement
 */

let deleteStatement = statement => {
  return statement.destroy();
}

let deleteStatementRoute = (rq, rs) => {
  req = rq;
  res = rs;
  return Promise.resolve()
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
  router.get('/api/statements', getStatementsRoute);
  router.post('/api/statements', createStatementRoute);
  router.get('/api/statements/:id', getStatementByIdRoute);
  router.put('/api/statements/:id', updateStatementRoute);
  router.delete('/api/statements/:id', deleteStatementRoute);
}