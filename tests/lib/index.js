// index.js
//
var spawn = require('child_process').spawn;
var path = require('path');
var fs = require('fs');
var glob = require('glob');

var parameters = require('./utils/parameters');
var branchName = parameters.getBranchName();
var config = require('./config');
var branchConfig = config.phantomjs.tasks[branchName];

var logger = require('./utils/logger');

// 1. Run `npm start`
// 2. Run `phantomjs phantomjs/<branchName>.js`
// 3. Kill `npm start`
// 4. When screenshots available for <branchName>, check them
// 5. Check results in tests/results.json
// 6. Log that stuff into console
// 7. In case that all's right, exit(0), otherwise exit(1)

var npmStart;

var npmStartStopLine = config.npmStart.stopLine;
var npmStartStartLine = config.npmStart.startLine;

var startDevServer = function() {
  var runNpm = function(resolve, reject) {
    npmStart = spawn('npm', ['start'], { detached: true });

    npmStart.stdout.on('data', function(data) {
      var text = data.toString();

      // logger.debug('DevServer: ' + text);
      if(npmStartStopLine && text.indexOf(npmStartStopLine) > -1) {
        logger.error('Could not start dev server');
        process.kill(-npmStart.pid);
        reject({
          message: 'Could not start dev server'
        });
      } else if(npmStartStartLine && text.indexOf(npmStartStartLine) > -1) {
        logger.info('Let\'s start phantomjs!');
        resolve();
      }
    });

    npmStart.on('error', function(err) {
      reject(err);
    });
  };

  logger.info('Start dev server');

  return new Promise(runNpm);
};

var runPhantomJs = function() {
  var runPJ = function(resolve, reject) {
    var phantomJs = spawn('phantomjs', [
      path.join(__dirname, 'phantomjs', branchName + '.js')
    ]);

    phantomJs.stdout.on('data', function(data) {
      var text = data.toString();
      logger.debug(text);

      if(text.indexOf('in __webpack_require__') > -1) {
        process.kill(-npmStart.pid);
        phantomJs.kill();
      }
    });

    phantomJs.stderr.on('data', function(data) {
      var text = data.toString();
      logger.warn(text);
    });

    phantomJs.on('exit', function(code) {
      process.kill(-npmStart.pid);

      if(code > 0) {
        logger.error('PhantomJs could not work properly');
        reject();    // TODO
      } else {
        logger.info('PhantomJs work completed');
        resolve();   // TODO ?
      }
    });
  };

  logger.info('Starting phantomjs');

  return new Promise(runPJ);
};

var prepareJsonResults = function() {
  var resultsPath = config.phantomjs.results;
  var buffer = fs.readFileSync(resultsPath);
  var text = buffer.toString();
  var data = JSON.parse(text);

  var success = true;

  logger.info('----------- Test results --------------');

  data.results.forEach(function(result) {
    if(result.result) {
      logger.info("[Ok   ] " + result.title);
    } else {
      success = false;
      logger.error("[FAIL] " + result.title);
    }
  });

  if(!success) {
    process.exit(1);
  }
};

var COMPARE_RE = /\d+(\.\d+)?\s+\((\d+(\.\d+)?)\)/;

var compareTwoScreenshots = function(result, etalonStep, targetStep) {
  var stepBase = path.basename(etalonStep, '.png');

  var runCompare = function(resolve, reject) {
    var cmp = spawn('compare', [
      '-metric',
      'RMSE',
      etalonStep,
      targetStep,
      '/dev/null'
    ]);

    logger.debug('Compare ' + etalonStep + ' against ' + targetStep);

    cmp.stderr.on('data', function(data) {
      var text = data.toString();
      var md = COMPARE_RE.exec(text);
      var percent;

      if(md) {
        percent = parseFloat(md[2]);
        result[stepBase] = 100 - percent;
        logger.debug(stepBase + ' got ' + result[stepBase] + ' percents');
        resolve(true);
      }
    });

    cmp.on('exit', function() {
      reject(false); // exit without result resolved
    });
  };

  return newPromise(runCompare);
};

var prepareScreenshotResults = function() {
  var result = {};

  var steps = glob.sync(
    path.join(config.screenshots, branchName, 'step-*.png')
  );

  var comparePromises = steps.map(function(step) {
    var stepBase = path.basename(step);
    var targetStep = path.join(config.screenshots, 'current', stepBase);

    return compareTwoScreenshots(result, step, targetStep);
  });

  return Promise.all(comparePromises).
    then(
      function() {
        console.log(results);
      });
};

var prepareResults = function() {
  if(branchConfig.useScreenshots) {
    prepareScreenshotResults();
  }

  if(branchConfig.useResults) {
    prepareJsonResults();
  }

  process.exit(0);
};


startDevServer().
  then(runPhantomJs).
  then(prepareResults);

// process.exit(0);
