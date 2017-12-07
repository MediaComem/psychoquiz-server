'use strict';
const debug = require('debug')('psychoquiz:chapters');

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
  chapter.title = req.body.title || chapter.title;
  chapter.intro = req.body.intro || chapter.intro;
  chapter.imgUrl = req.body.imgUrl || chapter.imgUrl;
  chapter.number = req.body.number || chapter.number;
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


let findParticipation = token => {
  return req.app.models.Participation.find({
    where: {
      token: token
    }
  });
}

let answeredChapters = participation => {
  if (!participation) {
    throw new Error('No participation with this token');
  }
  // get completed chapters
  return participation.getChapters(); // doesn't work
}

const inverseChapters = chapters => {
  // build id table
  let ids = [];
  for (let i = 0; i < chapters.length; i++) {
    ids.push(chapters[i].id);
  }
  return req.app.models.Chapter.findAll(
    {
      include:req.app.models.Statement,
      order: [
        [
          req.app.models.Statement, 'id', 'ASC'
        ]
      ]
    }) // todo change order by in include
    .then(allChapters => {
      return allChapters.filter(el => {
        return ids.indexOf(el.id) < 0;
      });
    });
}

const randomChapter = leftChapters => {
  if (leftChapters.length > 20) { // FIXME: change 20 in case there is less than 20 chapters total.
    return leftChapters[Math.floor(Math.random() * leftChapters.length)];
  }
  return {
    finished: true,
    Submissions: []
  };
  
}

const getRandomChapterRoute = (rq, rs) => {
  req = rq;
  res = rs;
  const token = req.query.pt;
  if (!token) {
    throw new Error('Invalid token');
  }
  return Promise.resolve(token)
    .then(findParticipation)
    .then(answeredChapters)
    .then(inverseChapters)
    .then(randomChapter)
    .then(success)
    .catch(error)
}

/**
 *  Route definitions
 */

module.exports = function (app, router) {
  router.get('/api/chapters', getChaptersRoute);
  router.get('/api/chapters/random', getRandomChapterRoute);
  router.get('/api/chapters/:id', getChapterByIdRoute);

  if (app.config.adminEnabled) {
    debug('Chapters admin API enabled');
    router.post('/api/chapters', createChapterRoute);
    router.put('/api/chapters/:id', updateChapterRoute);
    router.delete('/api/chapters/:id', deleteChapterRoute);
  } else {
    debug('Chapters admin API disabled');
  }
}
