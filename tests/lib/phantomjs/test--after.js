var page = require('webpage').create();

page.open('http://localhost:8080/test.html', function(status) {
  if(status === 'success') {
    page.render('review-failure-after.png');
  }

  phantom.exit(0);
});
