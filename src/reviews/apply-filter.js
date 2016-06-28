'use strict';

var renderReviews = require('./render-reviews');

var DAY = 1000 * 60 * 60 * 24;

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

var filterAll = function(reviews) {
  return reviews;
};

var filterRecent = function(reviews) {
  var now = Date.now();

  reviews = reviews.filter(function(review) {
    return (now - Date.parse(review.date)) / DAY < 4;
  });

  reviews.sort(compareDate(b, a));

  return reviews;
};

var filterGood = function(reviews) {
  reviews = reviews.filter(function(review) {
    return review.rating >= 3;
  });

  reviews.sort(compareGood);

  return reviews;
};

var filterBad = function(reviews) {
  reviews = reviews.filter(function(review) {
    return review.rating < 3;
  });

  reviews.sort(compareBad);

  return reviews;
};

var filterPopular = function(reviews) {
  reviews.sort(comparePopular);

  return reviews;
};

var FILTERS = {
  'reviews-all':     filterAll,
  'reviews-recent':  filterRecent,
  'reviews-good':    filterGood,
  'reviews-bad':     filterBad,
  'reviews-popular': filterPopular
};

var applyFilter = function(filterId, reviews) {
  var fnFilter = FILTERS[filterId];
  var reviews = fnFilter(reviews);

  renderReviews(reviews);
};

module.exports = applyFilter;
