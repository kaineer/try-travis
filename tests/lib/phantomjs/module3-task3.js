//
var branchName = 'module3-task3';
var config = require('../config/index.js').phantomjs;
var debug = config.debug;

var reviewName = 'Кекс';
var reviewText = 'Пендальф, ты стал белым теперь!';

var log = function(message) {
  if(debug) {
    console.log(message.replace(/\s+$/, ''));
  }
};

var page = require('webpage').create();
var fs = require('fs');

log('Just created page object');

var loadCount = 0;

var click = function(rect) {
  page.sendEvent('click', rect.left + 1, rect.top + 1);
};

var fillIn = function(rect, text) {
  click(rect);
  page.sendEvent('keypress', text);
};

var scrollToBottom = function() {
  var data = page.evaluate(function() {
    return {
      height: document.body.scrollHeight
    };
  });

  page.scrollPosition = {
    top: data.height - config.page.height,
    left: 0
  };
};

var showReviewForm = function() {
  var data = page.evaluate(function() {
    var showFormButton = document.querySelector('.reviews-controls-new');

    return {
      showFormButton: showFormButton.getBoundingClientRect()
    };
  });

  click(data.showFormButton);
};

log('Defined util functions');

var beforeReload = function() {
  scrollToBottom();
  showReviewForm();

  page.clearCookies();

  var data = page.evaluate(function() {
    var mark4 = document.querySelector('.review-mark-label-4');
    var nameInput = document.getElementById('review-name');
    var textInput = document.getElementById('review-text');
    var submitBtn = document.querySelector('.review-submit');

    return {
      mark4: mark4.getBoundingClientRect(),
      submitBtn: submitBtn.getBoundingClientRect(),
      nameInput: nameInput.getBoundingClientRect(),
      textInput: textInput.getBoundingClientRect()
    };
  });

  fillIn(data.nameInput, reviewName);
  fillIn(data.textInput, reviewText);

  click(data.mark4);
  click(data.submitBtn); // ===> POST
};

log('Defined beforeReload()');

page.onInitialized = function() {
  if(page.injectJs(config.shims) ) {
    log('PhantomJS: loaded shims');
  } else {
    log('PhantomJS: could not load shims.js');
  }
};

page.onResourceRequested = function(requestData, networkRequest) {
  log('onResourceRequested ' + requestData.url);

  if(requestData.method === 'POST') {
    networkRequest.abort();
    page.reload();
  }
};

var findCookie = function(name) {
  for(var i in page.cookies) {
    if(page.cookies[i].name === name) {
      return page.cookies[i];
    }
  }

  return undefined;
};

var cookieHasValue = function(name, value) {
  var cookie = findCookie(name);
  var cookieValue;

  if(cookie) {
    cookieValue = decodeURIComponent(cookie.value);

    return (value === cookieValue);
  }

  return false;
};

var afterReload = function() {
  scrollToBottom();
  showReviewForm();

  page.clipRect = {
    left: 225, top: 80,
    width: 565, height: 625
  };

  page.render('tests/screenshots/current/step-01.png');

  var results = [];

  var nameCookie = findCookie('review-name');

  log(nameCookie.value);

  results.push({
    title: 'Кука "review-name" должна иметь значение "' + reviewName + '"',
    result: cookieHasValue('review-name', reviewName)
  });

  results.push({
    title: 'Кука "review-mark" должна иметь значение "4"',
    result: cookieHasValue('review-mark', '4')
  });

  fs.write(config.results, JSON.stringify({results: results}));
};

page.onLoadFinished = function(status) {
  if(status === 'success') {
    loadCount += 1;

    log('Load finished: ' + loadCount);

    if(loadCount === 1) {
      // beforeReload();
    } else if(loadCount === 2) {
      afterReload();
      phantom.exit(0);
    }
  }
};

page.viewportSize = {
  width: config.page.width,
  height: config.page.height,
};

page.open(config.url, function(status) {
  if(status === 'success') {
    log('Page is loaded');
    beforeReload();
  } else {
    log('Could not load page');
    phantom.exit(0);
  }
});
