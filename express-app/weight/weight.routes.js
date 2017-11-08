'use strict';

let req, res;
let error = error => res.jsend.error(error);
let success = result => res.jsend.success(result);


/**
 * Get all Weights
 */
let getWeights = _ => {
  return req.app.models.Weight.findAll();
}

let getWeightsRoute = (rq, rs) => {
  req = rq;
  res = rs;
  return Promise.resolve()
    .then(getWeights)
    .then(success)
    .catch(error);
}

/**
 * Get a specific weight
 */

let findWeightById = _ => {
  return req.app.models.Weight.find({
    where: {
      id: req.params.id
    }
  });
}

let testWeight = weight => {
  if (!weight) {
    throw new Error('Weight not found');
  }
  return weight;
}

let getWeightByIdRoute = (rq, rs) => {
  req = rq;
  res = rs;
  return Promise.resolve()
    .then(findWeightById)
    .then(testWeight)
    .then(success)
    .catch(error);
}



/**
 * Create a new weight
 */
let createWeightRoute = (rq, rs) => {
  req = rq;
  res = rs;
  let newWeight = req.app.models.Weight.build({
    weightIfTrue: req.body.weightIfTrue,
    weightIfFalse: req.body.weightIfFalse,
    ProfileId: req.body.ProfileId,
    StatementId: req.body.StatementId
  });
  return Promise.resolve()
    .then(_ => newWeight.save())
    .then(success)
    .catch(error);
}

/**
 * Update a specific weight
 */
let updateWeight = weight => {
  weight.weightIfTrue = req.body.weightIfTrue || weight.weightIfTrue;
  weight.weightIfFalse = req.body.weightIfFalse || weight.weightIfFalse;
  wieght.ProfileId =  req.body.ProfileId || weight.ProfileId;
  wieght.StatementId =  req.body.StatementId || weight.StatementId;
  return weight.save();
}

let updateWeightRoute = (rq, rs) => {
  req = rq;
  res = rs;
  return Promise.resolve()
    .then(findWeightById)
    .then(testWeight)
    .then(updateWeight)
    .then(success)
    .catch(error);
}


/**
 * Delete a weight
 */

let deleteWeight = weight => {
  return weight.destroy();
}

let deleteWeightRoute = (rq, rs) => {
  req = rq;
  res = rs;
  return Promise.resolve()
    .then(findWeightById)
    .then(testWeight)
    .then(deleteWeight)
    .then(success)
    .catch(error);
}


/**
 *  Route definitions
 */

module.exports = function (app, router) {
  // TODO: Check if necessary
  /*router.get('/api/weights', getWeightsRoute);
  router.post('/api/weights', createWeightRoute);
  router.get('/api/weights/:id', getWeightByIdRoute);
  router.put('/api/weights/:id', updateWeightRoute);
  router.delete('/api/weights/:id', deleteWeightRoute);*/
}