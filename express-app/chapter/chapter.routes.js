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
  res = rs;
  return Promise.resolve()
    .then(getChapters)
    .then(success)
    .catch(error);
}

/**
 * Get a specific chapter
 */

let findChapterById = _ => {
    return req.app.models.Chapter.find({
      where: {
        id: req.params.id
      },
      include: [{
        model: req.app.models.Statement
      }]
    });      
}

let testChapter = chapter => {
  if (!chapter) {
    throw new Error('Chapter not found');
  }
  return chapter;
}

let getChapterByIdRoute = (rq, rs) => {
  req = rq;
  res = rs;
  return Promise.resolve()
    .then(findChapterById)
    .then(testChapter)
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
    imgUrl: req.body.imgUrl || '',
    title: req.body.title,
    number: req.body.number
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
  chapter.intro = req.body.intro || chapter.intro;
  chapter.imgUrl = req.body.imgUrl || chapter.imgUrl;
  return chapter.save();
}

let updateChapterRoute = (rq, rs) => {
  req = rq;
  res = rs;
  return Promise.resolve()
    .then(findChapterById)
    .then(testChapter)
    .then(updateChapter)
    .then(success)
    .catch(error);
}


/**
 * Delete a chapter
 */

let deleteChapter = chapter => {
  return chapter.destroy();
}

let deleteChapterRoute = (rq, rs) => {
  req = rq;
  res = rs;
  return Promise.resolve()
    .then(findChapterById)
    .then(testChapter)
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
  router.get('/api/chapters/:id', getChapterByIdRoute);
  router.put('/api/chapters/:id', updateChapterRoute);
  router.delete('/api/chapters/:id', deleteChapterRoute);
}