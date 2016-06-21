//
var branchName = 'module4-task1';
var config = require('../config/index.js').phantomjs;
var debug = config.debug;

var log = function(message) {
  if(debug) {
    console.log(message.replace(/\s+$/, ''));
  }
};

var page = require('webpage').create();
var server = require('webserver').create();
var fs = require('fs');

var jsonpUrl = '//up.htmlacademy.ru/assets/js_intensive/jsonp/reviews.js';
var jsonpStub = '/reviews.js';

/// SERVER
server.listen(config.stubServer, function(request, response) {
  if(request.url.indexOf(jsonpStub) > -1) {
    var content = fs.read(config.stubDataDir + '/jsonp.js');

    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/javascript');
    response.write(content);
    response.close();
  }
});

/// PAGE
page.onResourceRequested = function(requestData, networkRequest) {
  if(requestData.url.indexOf(config.jsonpUrl) > -1) {
    networkRequest.changeUrl('http://' + config.stubServer + jsonpStub);
    // TODO: continue
  }
};
