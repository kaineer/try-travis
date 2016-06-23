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
  log('SERVER: ' + request.url);

  if(request.url.indexOf(jsonpStub) > -1) {
    var content = fs.read(config.stubDataDir + '/jsonp.js');

    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/javascript');
    response.write(content);
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

var renderPage = function() {
  page.scrollPosition = {
    top: 1590,
    left: 0
  };

  page.clipRect = {
    top: 6, left: 138,
    width: 768, height: 1232
  };

  var style = page.evaluate(function() {
    var wrongImg =
        document.querySelector('.review-load-failure .review-author');
    return getComputedStyle(wrongImg, ':after');
  });

  log(style.visibility);

  log('Rendering step');
  page.render('tests/screenshots/current/step-01.png');
};

page.onLoadFinished = function() {
  renderPage();
  phantom.exit(0);
};

page.onResourceError = function(resourceError) {
  log(resourceError.url);
  // if(resourceError.url.indexOf('xx') > -1) {
  //   log(resourceError.url);
  //   renderPage();
  //   phantom.exit(0);
  // }
};

page.open(config.url, function(status) {
});
