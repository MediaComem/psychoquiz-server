'use strict';

function getConfig(req, res) {
  res.jsend.success({
    adminEnabled: req.app.config.adminEnabled,
    version: require('../../package').version
  });
}

module.exports = function (app, router) {
  router.get('/api/config', getConfig);
};
