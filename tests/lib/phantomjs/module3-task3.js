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
      extents: {
        height: document.body.scrollHeight
      }
    };
  },
  page: function(page, data) {
    page.scrollPosition = {
      top: data.extents.height - config.page.height,
      left: 0
    };
  },
  opts: { render: false }
}).step({
  html: function() {
    var showFormButton = document.querySelector('.reviews-controls-new');
    return {
      showFormButton: showFormButton.getBoundingClientRect()
    };
  },
  page: function(page, data) {
    var br = data.showFormButton;
    page.sendEvent('click', br.left + 1, br.top + 1);
  },
  opts: { render: false }
}).step({
  html: function() {
    var mark4 = document.querySelector('.review-mark-label-4');
    var nameInput = document.getElementById('review-name');
    var textInput = document.getElementById('review-text');
    var submitBtn = document.querySelector('.review-submit');

    nameInput.value = 'Кекс';
    textInput.value = '';

    return {
      mark4: mark4.getBoundingClientRect(),
      submitBtn: submitBtn.getBoundingClientRect()
    };
  },

  page: function(page, data) {
    var br = data.mark4;

    page.sendEvent('click', br.left + 1, br.top + 1);

    br = data.submitBtn;

    page.clipRect = {
      left: 225, top: 80,
      width: 565, height: 625
    };

    page.sendEvent('click', br.left + 1, br.top + 1);

    page.reload();
  },

  opts: { render: true }

}).


run(function() {
  phantom.exit();
});
