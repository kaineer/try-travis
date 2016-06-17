// phantomjs/utils/context.js
// BE WARNED: this runs under phantomjs. This means another environment.

var config = require('../../config').phantomjs;

var debug = config.debug;

var log = function(message) {
  if(debug) {
    console.log(message);
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
};

cp.run = function(callback) {
  log('Context#run');

  var ctx = this;
  this.page = require('webpage').create();

  this.page.viewportSize = {
    width: config.page.width,
    height: config.page.height,
  };

  this.page.onConsoleMessage = function(msg, lineNum, sourceId) {
    console.log('PhantomJS: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
  };

  log("Before open");

  this.page.open(this.url, function(status) {
    if(status === 'success') {
      ctx.runSteps();
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
      this.mergeResult(this.page.evaluate(html));
    }

    if(page) {
      page(this.page, this.data);
    }

    if(opts.render) {
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
  return new Conext(url, screenshots);
};
