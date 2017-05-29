'use strict';

let req, res;

let getResults = (rq, rs) => {
  req = rq;
  res = rs;
  res.jsend.success({
      result: "result !"
  });
}



module.exports = function (app, router) {
    router.get('/api/answers',  getResults);
}
