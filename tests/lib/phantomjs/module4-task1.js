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

page.onError = function(msg, trace) {

  var msgStack = ['ERROR: ' + msg];

  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
    });
  }

  console.error(msgStack.join('\n'));
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

  page.render('tests/screenshots/current/step-01.png');
};

// var saveResults = function() {
//   log(0);

//   // var reviewHasError = page.evaluate(function() {
//   //   var review = document.querySelector('.review')[3];
//   //   return review.classList.contains('review-load-failure');
//   // });

//   // console.log(1);

//   // var results = [
//   //   { title: 'Четвёртый отзыв не может загрузить аватар',
//   //     result: reviewHasError
//   //   }
//   // ];


//   // console.log(2);


//   // fs.write(config.report, JSON.stringify(results));

//   // console.log(3);
// };

var saveResults = function() {
  var reviewHasError = page.evaluate(function() {
    var review = document.querySelectorAll('.review')[3];
    return review.classList.contains('review-load-failure');
  });

  var results = [
    { title: 'Четвёртый отзыв не может загрузить аватар',
      result: reviewHasError
    }
  ];

  fs.write(config.results, JSON.stringify({results: results}), 'w');
};

page.onResourceReceived = function(response) {
  log('Received: ' + response.url);
};

page.open(config.url, function(status) {
  if(status === 'success') {
    log('Render page');
    renderPage();
    saveResults();
  }

  phantom.exit(0);
});

setTimeout(function() {
  phantom.exit(1);
}, 2000);
