// config/index.js
module.exports = {
  branchFileName: './branch-name',

  npmStart: require('./npm-start'),

  log_level: 'DEBUG',

  phantomjs: {
    // Default config for phantomjs step
    defaultStepOpts: { render: true },

    //
    url: 'http://localhost:8080',

    // Directory to store screenshots
    screenshots: "tests/screenshots/current/",

    // Filename to store results
    results: "tests/results.json",

    //
    shims: "tests/lib/phantomjs/utils/shims.js",

    // Page extents
    page: {
      width: 1024,
      height: 800
    },

    // Turn on if you need some debugging from phantomjs
    debug: true,

    tasks: {
      'module1-task2': require('./tasks/module1-task2'),
      'module3-task2': require('./tasks/module3-task2')
    }
  }
};
