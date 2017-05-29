'use strict';

let glob = require('glob');

/**
 * Load all files named "*.routes.js"
 */
module.exports = function (app, router) {
    glob(__dirname + "/**/*.routes.js", (er, files) => {
        files.forEach((file) => {
            require(file)(app, router);
        });
    })
}