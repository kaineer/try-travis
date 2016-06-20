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

    var fnANumber = function(getMessage) {
      return getMessage(5) === 'Я прыгнул на 500 сантиметров';
    };

    var fnAArray = function(getMessage) {
      return getMessage([1, 2, 3, 4]) === 'Я прошёл 10 шагов';
    };

    var fnABArrays = function(getMessage) {
      return getMessage([1, 2, 3, 4], [2, 2, 2, 2]) === 'Я прошёл 20 метров';
    };

    var tests = [
      { label: 'Функция должна быть определена', test: fnExists, block: true },
      { label: 'Если a === true',         test: fnATrue },
      { label: 'Если a === false',        test: fnAFalse },
      { label: 'Если a - число',          test: fnANumber },
      { label: 'Если a - массив',         test: fnAArray },
      { label: 'Если a и b - массивы',    test: fnABArrays }
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
