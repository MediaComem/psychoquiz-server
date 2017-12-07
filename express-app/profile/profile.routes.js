'use strict';
const debug = require('debug')('psychoquiz:profiles');

let req, res;
let error = error => res.jsend.error(error);
let success = result => res.jsend.success(result);


/**
 * Get all Profiles
 */
let getProfiles = _ => {
  return req.app.models.Profile.findAll();
}

let getProfilesRoute = (rq, rs) => {
  req = rq;
  res = rs;
  return Promise.resolve()
    .then(getProfiles)
    .then(success)
    .catch(error);
}

/**
 * Get a specific profile
 */

let findProfileById = _ => {
  return req.app.models.Profile.find({
    where: {
      id: req.params.id
    }
  });
}

let testProfile = profile => {
  if (!profile) {
    throw new Error('Profile not found');
  }
  return profile;
}

let getProfileByIdRoute = (rq, rs) => {
  req = rq;
  res = rs;
  return Promise.resolve()
    .then(findProfileById)
    .then(testProfile)
    .then(success)
    .catch(error);
}



/**
 * Create a new profile
 */
const createProfileRoute = (rq, rs) => {
  req = rq;
  res = rs;
  const newProfile = req.app.models.Profile.build({
    name: req.body.name,
    description: req.body.description,
    body: req.body.body    
  });
  return Promise.resolve()
    .then(_ => newProfile.save())
    .then(success)
    .catch(error);
}

/**
 * Update a specific profile
 */
const updateProfile = profile => {
  profile.name = req.body.name || profile.name;
  profile.description = req.body.description || profile.description;
  profile.body = req.body.body || profile.body;
  
  return profile.save();

}

const updateProfileRoute = (rq, rs) => {
  req = rq;
  res = rs;
  return Promise.resolve()
    .then(findProfileById)
    .then(testProfile)
    .then(updateProfile)
    .then(success)
    .catch(error);
}


/**
 * Delete a profile
 */

const deleteProfile = profile => {
  return profile.destroy();
}

const deleteProfileRoute = (rq, rs) => {
  req = rq;
  res = rs;
  return Promise.resolve()
    .then(findProfileById)
    .then(testProfile)
    .then(deleteProfile)
    .then(success)
    .catch(error);
}

/**
 *  Route definitions
 */

module.exports = function (app, router) {
  if (app.config.adminEnabled) {
    debug('Profiles admin API enabled');
    router.get('/api/profiles', getProfilesRoute);
    router.post('/api/profiles', createProfileRoute);
    router.get('/api/profiles/:id', getProfileByIdRoute);
    router.put('/api/profiles/:id', updateProfileRoute);
    router.delete('/api/profiles/:id', deleteProfileRoute);
  } else {
    debug('Profiles admin API disabled');
  }
}
