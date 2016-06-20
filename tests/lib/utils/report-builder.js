var path = require('path');
var logger = require('./logger');
var config = require('../config');

var parameters = require('./parameters');
var branchName = parameters.getBranchName();
var branchConfig = config.phantomjs.tasks[branchName];

var etalonScreenshots = path.join(config.screenshots, branchName);
var targetScreenshots = config.phantomjs.screenshots;

etalonScreenshots = etalonScreenshots.substr('tests/'.length);
targetScreenshots = targetScreenshots.substr('tests/'.length);

// Synopsis: for use from runner
//
var ReportBuilder = function() {
  logger.debug('ReportBuilder.ctor()');
  this.etalonScreenshots = etalonScreenshots;
  this.targetScreenshots = targetScreenshots;
  this.steps = branchConfig.messages;
};

var div = function(className, content) {
  return "<div class='" +
    className + "'>" + content + "</div>";
};

var img = function(src) {
  return "<img src='" + src + "' alt=''>";
};

var template =
    "<html><head><link href='./css/style.css' rel='stylesheet' type='text/css'>" +
    "<title>Результаты проверки</title></head>" +
    "<body><h1>Результаты проверки</h1>{content}</body></html>";

Object.assign(ReportBuilder.prototype, {
  run: function(results) {
    logger.debug('ReportBuilder.run()');

    var builder = this;
    var steps = this.steps;

    this.results = results;

    var content = Object.keys(steps).sort().map(function(key, i) {
      var step = steps[key];
      return builder.getStepContent(step, key, i);
    }).join('');

    return template.replace('{content}', content);
  },
  getStepContent: function(step, key, i) {
    var content = this.getTextContent(step, key, i + 1);
    var percent = this.results[key];
    var status = 'unknown';

    if(typeof(percent) === 'number') {
      status = (percent >= config.treshold) ? 'success' : 'failure';
    }

    content += this.getImageContent(step, key);

    content = div('step step_' + status, content);

    return content;
  },
  getTextContent: function(step, key, i) {
    var content = div("step__title", 'Шаг ' + i + '. ' + step.title);

    var percent = this.results[key];

    if(step.requirements) {
      content += div("step__requirements", step.requirements);
    }

    if(typeof(percent) === 'number') {
      content += div('step__result', 'Совпадение ' + percent.toFixed(2) + '%');
    }

    return content;
  },
  getImageContent: function(step, key) {
    var content =
        div('step__image step__image_etalon',
            img(path.join(this.etalonScreenshots, key + '.png'))) +
        div('step__image step__image_target',
            img(path.join(this.targetScreenshots, key + '.png')));

    return content;
  }
});

module.exports = ReportBuilder;
