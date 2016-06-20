// phantomjs/utils/context.js
// BE WARNED: this runs under phantomjs. This means another environment.

var config = require('../../config/index.js').phantomjs;
var fs = require('fs');

var debug = config.debug;

var log = function(message) {
  if(debug) {
    console.log(message.replace(/\s+$/, ''));
  }
};

var defaultStepOpts = config.defaultStepOpts;

/**
 * Context for running phantomjs tests
 * @param {string} url - url to load for testing
 * @param {string} screenshots - path to store screenshots
 */
var Context = function(url, screenshots) {
  this.url = url || config.url;
  this.screenshots = screenshots || config.screenshots;
};

var cp = Context.prototype;

cp.step = function(opts) {
  (this.steps || (this.steps = [])).push(opts);
  return this;
};

cp.run = function(callback) {
  log('Context#run');

  var ctx = this;
  var page = this.page = require('webpage').create();

  page.viewportSize = {
    width: config.page.width,
    height: config.page.height,
  };

  page.onConsoleMessage = function(msg, lineNum, sourceId) {
    log('PhantomJS: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
  };

  page.onInitialized = function() {
    if(page.injectJs(config.shims) ) {
      log('PhantomJS: loaded shims');
    } else {
      log('PhantomJS: could not load shims.js');
    }
  };

  log("Before open");

  page.open(this.url, function(status) {
    if(status === 'success') {
      ctx.runSteps();
    } else {
      log('Could not open page');
    }

    callback(ctx.data);
  });
};

cp.runSteps = function() {
  var step;
  var html, page, opts;

  for(var i = 0; i < this.steps.length; ++i) {
    step = this.steps[i];

    html = step.html;
    page = step.page;
    opts = step.opts || defaultStepOpts;

    if(html) {
      log('Step: ' + (i+1) + ', evaluate in DOM');
      this.mergeResult(this.page.evaluate(html));
      log('Step: ' + (i+1) + ', evaluate in DOM, done');
    }

    if(page) {
      log('Step: ' + (i+1) + ', work from phantom api');
      page(this.page, this.data);
      log('Step: ' + (i+1) + ', work from phantom api, done');
    }

    log(typeof(opts));

    if(opts.render) {
      log('Step: ' + (i+1) + ', render page');
      this.page.render(this.screenshotPath(i + 1));
    }
  }
};

cp.mergeResult = function(data) {
  this.data || (this.data = {});

  if(data && typeof(data) === 'object') {
    for(var key in data) {
      if(data.hasOwnProperty(key)) {
        this.data[key] = data[key];
      }
    }
  }
};

cp.screenshotPath = function(n) {
  var stepName = 'step-0' + n + '.png';

  if(n > 9) {
    stepName = 'step-' + n + '.png';
  }

  return this.screenshots + stepName;
};

Context.create = function(url, screenshots) {
  return new Context(url, screenshots);
};

module.exports = Context;
