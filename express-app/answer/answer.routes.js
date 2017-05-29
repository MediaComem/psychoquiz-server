'use strict';


let req, res;
let error = error => res.jsend.error(error);
let success = result => res.jsend.success(result);

let getAnswers = (rq, rs) => {
  req = rq;
  res = rs;
  req.app.models.Answer.findAll().then(success);
}



module.exports = function (app, router) {
    router.get('/api/answers',  getAnswers);
}
