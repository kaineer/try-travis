// phantomjs/module1-task2.js
//

var config = require('../config/index.js').phantomjs;
var debug = config.debug;

var log = function(message) {
  if(debug) {
    console.log(message.replace(/\s+$/, ''));
  }
};

var branchName = 'module1-task2';
var config = require("../config").phantomjs;
var taskConfig = config.tasks[branchName];
var messages = taskConfig.messages;


var context = require('./utils/context.js').create();

var fs = require('fs');


context.step({
  html: function() {
    var getMessage = window.getMessage;
    var results = [];

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
      { label: 'Функция должна быть определена', test: fnExists, block: true },
      { label: 'Если a === true',         test: fnATrue },
      { label: 'Если a === false',        test: fnAFalse }
    ];

    for(var i = 0; i < tests.length; ++i) {
      var test = tests[i];
      var result = test.test(getMessage);

      results.push({
        title: test.label,
        result: result
      });

      if(!result && test.block) {
        break;
      }
    }

    return {
      results: results
    };
  },
  opts: {
    render: false
  }
}).run(function(data) {
  fs.write(config.results, JSON.stringify(data), 'w');
  phantom.exit();
});
