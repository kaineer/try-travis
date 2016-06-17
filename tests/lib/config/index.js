// config/index.js
module.exports = {
  branchFileName: './branch-name',

  npmStart: require('./npm-start'),

  log_level: 'DEBUG',

  phantomjs: {
    // Default config for phantomjs step
    defaultStepConfig: { render: true },

    // Directory to store screenshots
    screenshots: "tests/screenshots",

    // Filename to store results
    results: "tests/results.json",

    // Page extents
    page: {
      width: 1024,
      height: 800
    },

    // Turn on if you need some debugging from phantomjs
    debug: false,

    tasks: {
      'module1-task2': require('./tasks/module1-task2')
    }
  }
};
