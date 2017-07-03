'use strict';

let req, res;
let error = error => res.jsend.error(error);
let success = result => res.jsend.success(result);


/**
 * Get all chapters
 */
let getChapters = _ => {
  return req.app.models.Chapter.findAll();
}

let getChaptersRoute = (rq, rs) => {
  req = rq;
  res = rs; // closures \o/
  return Promise.resolve()
    .then(getChapters)
    .then(success)
    .catch(error);
}

/**
 * Get a specific chapter
 */

let getChapterById = _ => {
  return req.app.models.Chapter.findById(req.params.id);
}

let getChapterByIdRoute = (rq, rs) => {
  req = rq;
  res = rs;
  return Promise.resolve()
    .then(getChapterById)
    .then(success)
    .catch(error);
}



/**
 * Create a new chapter
 */
let createChapterRoute = (rq, rs) => {
  req = rq;
  res = rs;
  let newChapter = req.app.models.Chapter.build({
    intro: req.body.intro,
    imgUrl: req.body.imgUrl || ''
  });
  return Promise.resolve()
    .then(_ => newChapter.save())
    .then(success)
    .catch(error); // A tester svp
}

/**
 * Update a specific chapter
 */
let updateChapter = chapter => {
  if (!chapter) {
    throw new Error('Chapter not found');
  }
  chapter.intro = req.body.intro || chapter.intro;
  chapter.imgUrl = req.body.imgUrl || chapter.imgUrl;
  return chapter.save();
}

let updateChapterRoute = (rq, rs) => {
  req = rq;
  res = rs;
  return Promise.resolve()
    .then(getChapterById)
    .then(updateChapter)
    .then(success)
    .catch(error);
}


/**
 * Delete a chapter
 */

let deleteChapter = chapter => {
  if (!chapter) {
    throw new Error('Chapter not found');
  }
  return chapter.destroy();
}

let deleteChapterRoute = (rq, rs) => {
  req = rq;
  res = rs;
  return Promise.resolve()
    .then(getChapterById)
    .then(deleteChapter)
    .then(success)
    .catch(error);
}


/**
 *  Route definitions
 */

module.exports = function (app, router) {
  router.get('/api/chapters', getChaptersRoute);
  router.post('/api/chapters', createChapterRoute);
  router.get('/api/chapters/:id', updateChapterRoute);
  router.put('/api/chapters/:id', updateChapterRoute);
}