// phantomjs/utils/log.js
//
var config = require('../../config/index.js').phantomjs;
var debug = config.debug;

var log = function() {};

if(debug) {
  log = function(message) {
    console.log('PhantomJs: ' + message);
  }
}

module.exports = log;
