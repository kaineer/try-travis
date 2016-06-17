// index.js
//
var spawn = require('child_process').spawn;
var path = require('path');
var fs = require('fs');

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

  var success = false;

  data.results.forEach(function(result) {
    if(result.result) {
      logger.info("[Ok   ] " + result.title);
    } else {
      logger.error("[FAIL] " + result.title);
    }
  });

  if(!success) {
    process.exit(1);
  }
};

var prepareResults = function() {
  if(branchConfig.useScreenshots) {
    // prepareScreenshotResults();
  }
  if(branchConfig.useResults) {
    prepareJsonResults();
  }
};


startDevServer().
  then(runPhantomJs).
  then(prepareResults);

// process.exit(0);
