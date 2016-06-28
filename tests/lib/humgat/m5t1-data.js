var config = require('../config/index.js').phantomjs;
var branchName = 'module5-task1';
var fs = require('fs');

var text = fs.read(config.stubDataDir + 'reviews.json');
var data = JSON.parse(text);

var allDescriptions, goodDescriptions, badDescriptions, popularDescriptions;

var getDescription = function(d) { return d.description; };

var compareDate = function(a, b) {
  if(a.date < b.date) {
    return -1;
  } else if(a.date > b.date) {
    return 1;
  }

  return 0;
};

var compareGood = function(a, b) {
  var diff = b.rating - a.rating;

  if(diff === 0) {
    return compareDate(a, b);
  } else {
    return diff;
  }
};

var compareBad = function(a, b) {
  var diff = a.rating - b.rating;

  if(diff === 0) {
    return compareDate(a, b);
  } else {
    return diff;
  }
};

var comparePopular = function(a, b) {
  var diff = b.review_usefulness - a.review_usefulness;

  if(diff === 0) {
    return compareDate(a, b);
  } else {
    return diff;
  }
};

allDescriptions = data.map(getDescription);

goodDescriptions = data.filter(function(d) { return d.rating > 2; });
goodDescriptions.sort(compareGood);

badDescriptions = data.filter(function(d) { return d.rating < 3; });
badDescriptions.sort(compareBad);

popularDescriptions = data.slice();
popularDescriptions.sort(comparePopular);

fs.write('./m5t1.json',
  JSON.stringify({
    all: allDescriptions,
    good: goodDescriptions.map(getDescription),
    bad: badDescriptions.map(getDescription),
    popular: popularDescriptions.map(getDescription)
  }, null, 2)
);
