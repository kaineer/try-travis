// phantomjs/module3-task3.js
//

var config = require('../config/index.js').phantomjs;
var debug = config.debug;

var log = function(message) {
  if(debug) {
    console.log(message.replace(/\s+$/, ''));
  }
};

var branchName = 'module3-task3';
var taskConfig = config.tasks[branchName];

var context = require('./utils/context.js').create();

context.step({
  html: function() {
    var showFormButton = document.querySelector('.reviews-controls-new');

    var template = document.getElementById('review-template');
    template.style.display = 'none';

    return {
      showFormButton: showFormButton.getBoundingClientRect(),
      extents: {
        height: document.body.scrollHeight
      }
    };
  },
  page: function(page, data) {
    var br = data.showFormButton;

    page.scrollPosition = {
      top: data.extents.height - config.page.height,
      left: 0
    };

    page.sendEvent("click", br.left + 1, br.top + 1);
  },
  opts: { render: true }
}).run(function() {
  phantom.exit();
});
