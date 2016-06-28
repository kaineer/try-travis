//
// humgat/module5-task1.js
//

var humgat = require('./utils/humgat.js').create();
var branchName = 'module5-task1';

require('./utils/humgat-common.js')(humgat);
require('./utils/humgat/redirects.js')(humgat);

var selector = {
  filterAll:  '.reviews-filter-item[for$=all]',
  filterGood: '.reviews-filter-item[for$=good]',
  filterBad:  '.reviews-filter-item[for$=bad]',
  filterPopular: '.reviews-filter-item[for$=popular]'
};

humgat.redirects({
  urlPattern: '//o0.github.io/assets/json/reviews.json',
  file: 'reviews.json'
}).on('page.open.success', function() {
  var branchConfig = this.config[branchName];
  var contents = branchConfig.contents;

  this.emit('filter.reviews.check', selector.filterAll,  contents.all, 'Все');
  this.emit('filter.reviews.check', selector.filterGood, contents.good, 'Хорошие');
  this.emit('filter.reviews.check', selector.filterBad,  contents.bad, 'Плохие');
  this.emit('filter.reviews.check', selector.filterPopular, contents.popular, 'Популярные');

  this.emit('suite.done');
}).on('filter.reviews.check', function(selector, contents, filterName) {
  var domContents;

  this.dom.click(selector);
  domContents = this.page.evaluate();

  this.dom.assertEqual(
    contents,
    function() {
      var elements =
          document.querySelectorAll('.reviews-list .review-text');
      return elements.map(function(el) { return el.textContent; });
    },
    'Сравнение по фильтру ' + filterName);
}).run();
