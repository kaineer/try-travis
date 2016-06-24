//
var branchName = 'module5-task1';
var config = require('../config/index.js').phantomjs;
var log = require('./utils/log.js');

var page = require('webpage').create();
var server = require('webserver').create();
var fs = require('fs');

var jsonUrl = '//up.htmlacademy.ru/assets/js_intensive/jsonp/reviews.js';
var jsonStub = '/reviews.json';

/// SERVER
server.listen(config.stubServer, function(request, response) {
  log('SERVER: ' + request.url);

  if(request.url.indexOf(jsonStub) > -1) {
    var content = fs.read(config.stubDataDir + '/reviews.json');

    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    resonse.write(content);
    response.close();
  }
});

/// PAGE
page.onInitialized = function() {
  if(page.injectJs(config.shims) ) {
    log('PhantomJS: loaded shims');
  } else {
    log('PhantomJS: could not load shims.js');
  }
};

page.onConsoleMessage = function(message) {
  log('console.log: ' + message);
};

page.onResourceRequested = function(requestData, networkRequest) {
  log('ResourceRequested: ' + requestData.url);

  if(requestData.url.indexOf(jsonpUrl) > -1) {
    log('Redirecting..');
    networkRequest.changeUrl('http://' + config.stubServer + jsonpStub);
  }
};

page.open(config.url, function(status) {
  if(status === 'success') {

    page.scrollPosition = {
      top: 1590,
      left: 0
    };

    page.clipRect = {
      top: 6, left: 138,
      width: 768, height: 1232
    };

    page.render('tests/screenshots/current/step-01.png');

    phantom.exit(0);
  }
});
