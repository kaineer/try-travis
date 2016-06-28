// phantomjs/utils/redirects.js

var utils = require('./utils.js');

var redirects = [];

/**
 * Find redirect by url/redirect field
 * @param {Object} pattern to find
 *   @key 'url' - find redirect by url
 *   @key 'redirect' - find redirect by redirect slug/filename
 */
var findRedirect = function(pattern) {
  if(pattern.url) {
    return utils.find(function(redirects, function(redirect) {
      return redirect.url === pattern.url;
    });
  }
};


exports.addRedirect = addRedirect;
exports.findRedirect = findRedirect;
