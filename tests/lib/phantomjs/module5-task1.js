//
var branchName = 'module5-task1';
var config = require('../config/index.js').phantomjs;
var log = require('./utils/log.js');

var page = require('webpage').create();
var server = require('webserver').create();
var fs = require('fs');

var jsonUrl = '//up.htmlacademy.ru/assets/js_intensive/jsonp/reviews.js';
var jsonStub = '/reviews.json';

var stage = 0;
var resources = require('./utils/resources.js').create(page);
var loading = true;
var fontLoaded = false;
var cleanCount = 0;


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
  if(stage === 0) {
    if(page.injectJs(config.shims) ) {
      log('PhantomJS: loaded shims');
      flagInitialized = true;
    } else {
      log('PhantomJS: could not load shims.js');
    }
  }
};


var renderPage = function(n) {
    page.scrollPosition = {
      top: 1590,
      left: 0
    };

    page.clipRect = {
      top: 6, left: 138,
      width: 768, height: 1232
    };

    log('Render step-0' + n);
    page.render(config.screenshots + 'step-0' + n + '.png');
};

page.onLoadFinished = function() {
  if(stage === 0) {
    renderPage(1);
    click('.reviews-filter-item[for$=good]');
    stage = 1;
  }

  // if(stage === 0) {
  //   stage = 1;
  // } else {
  //   log('Render step-0' + stage);
  //   page.render(config.screenshots + 'step-0' + stage + '.png');

  //   if(stage === 1) {
  //     click('.reviews-filter-item[for$=good]');
  //   }

  //   stage += 1;
  // }
};

page.onConsoleMessage = function(message) {
  log('console.log: ' + message);
};

resources.on('resource.requested', function(requestData, networkRequest) {
  // if(requestData.url.indexOf('.ttf') > -1) {
  //   log('ResourceRequested: ' + requestData.url);
  // }

  if(requestData.url.indexOf(jsonpUrl) > -1) {
    log('Redirecting..');
    networkRequest.changeUrl('http://' + config.stubServer + jsonpStub);
  }
}).on('resource.received', function(resource) {
  // if(requestData.url.indexOf('ttf') > -1) {
    log('ResourceReceived: ' + resource.url);
  // }

  if(resource.url.indexOf('.ttf') > -1) {
    fontLoaded = true;
  }
}).on('resource.clean', function(page) {
  log('RESOURCE CLEAN');

  if(stage === 1) {
    renderPage(2);
  }
});


var click = function(selector) {
  return page.evaluate(function(selector) {
    var element = document.querySelector(selector);
    if(element) {
      element.click();
      return true;
    } else {
      return false;
    }
  }, selector);
};

page.open(config.url, function(status) {
  var opts, br;

  if(status === 'success') {
  }
});

var loadCounter = 0;
