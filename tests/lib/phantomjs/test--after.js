var page = require('webpage').create();

page.onResourceReceived = function(resource) {
  if(resource.stage === 'end') {
    console.log('[resource.received] ' + resource.url);
  }
};

page.onResourceRequested = function(request, nw) {
  console.log('[resource.requested] ' + request.url);
};

page.open('http://localhost:8080/test.html', function(status) {
  if(status === 'success') {
    page.render('review-failure-after.png');

    var style = page.evaluate(function() {
      var wrongImg =
          document.querySelector('.review-load-failure .review-author');
      return getComputedStyle(wrongImg, ':after');
    });

    console.log('style.opacity: ' + style.opacity); // => 1

    var html = page.evaluate(function() {
      return document.querySelector('.review-load-failure').outerHTML;
    });

    console.log('html: \n' + html);

    phantom.exit(0);
  }
});
