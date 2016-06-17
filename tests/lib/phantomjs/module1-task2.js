// phantomjs/module1-task2.js
//
var branchName = 'module1-task2';
var config = require("../config").phantomjs;
var messages = config.messages[branchName];

var context = require('./utils/context').create();

var fs = require('fs');

var fnExists = function(getMessage) {
  return typeof(getMessage) === 'function';
};

var fnATrue = function(getMessage) {
  return getMessage(true, 'дерево') === 'Я попал в дерево';
};

var fnAFalse = function(getMessage) {
  return getMessage(false) === 'Я никуда не попал';
};

var tests = [
  { label: 'function.exist', test: fnExists, block: true },
  { label: 'a.true',         test: fnATrue },
  { label: 'a.false',        test: fnAFalse }
];

context.step({
  html: function() {
    var getMessage = window.getMessage;
    var results = [];

    for(var i = 0; i < tests.length; ++i) {
      var test = tests[i];
      var result = test.test(getMessage);

      results.push({
        title: messages[test.label],
        result: result
      });

      if(!result && test.block) {
        break;
      }
    }

    return {
      results: results
    };
  }, {
    render: false
  }
}).run(function(data) {
  fs.write(config.results, data, 'w');
  phantom.exit();
});
