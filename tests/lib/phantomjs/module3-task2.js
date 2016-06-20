// phantomjs/module3-task2.js
//

var config = require('../config/index.js').phantomjs;
var debug = config.debug;

var log = function(message) {
  if(debug) {
    console.log(message.replace(/\s+$/, ''));
  }
};

var branchName = 'module3-task2';
var taskConfig = config.tasks[branchName];

var context = require('./utils/context.js').create();

context.step(
  {
    html: function() {
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

      page.clipRect = {
        left: 91, top: 353,
        width: 864, height: 263
      };
    }
  }
).step(
  {
    html: function() {
      var showFormButton = document.querySelector('.reviews-controls-new');
      var sfbPos = showFormButton.getBoundingClientRect();
      return {
        showFormButton: sfbPos
      }
    },
    page: function(page, data) {
      var br = data.showFormButton;
      page.sendEvent("click", br.left + 1, br.top + 1);

      page.clipRect = {
        left: 225, top: 80,
        width: 565, height: 625
      };
    }
  }
).step(
  {
    html: function() {
      var mark2 = document.querySelector('.review-mark-label-2');
      return {
        mark2: mark2.getBoundingClientRect()
      };
    },
    page: function(page, data) {
      var br = data.mark2;
      page.sendEvent("click", br.left + 1, br.top + 1);
    }
  }
).step(
  {
    html: function() {
      var nameInput = document.getElementById('review-name');

      return {
        nameInput: nameInput.getBoundingClientRect()
      };
    },
    page: function(page, data) {
      var br = data.nameInput;
      page.sendEvent("click", br.left + 1, br.top + 1);
      page.sendEvent("keypress", "Кекс");
    }
  }
).step(
  {
    html: function() {
      var textInput = document.getElementById('review-text');

      return {
        textInput: textInput.getBoundingClientRect()
      };
    },
    page: function(page, data) {
      var br = data.textInput;
      page.sendEvent("click", br.left + 1, br.top + 1);
      page.sendEvent("keypress",
                     "Не хватает пальцев на лапах для управления магом.");
    }
  }
).run(function() {
  phantom.exit();
});
