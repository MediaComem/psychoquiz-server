'use strict';

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

let createStatementRoute = (rq, rs) => {
  req = rq;
  res = rs;
  return Promise.resolve()
    .then(findChapterById)
    .then(testChapter)
    .then(createStatement)
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