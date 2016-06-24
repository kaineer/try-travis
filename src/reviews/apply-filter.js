'use strict';

var renderReviews = require('./render-reviews');

var DAY = 1000 * 60 * 60 * 24;

var filterAll = function(reviews) {
  return reviews;
};

var filterRecent = function(reviews) {
  var now = Date.now();

  reviews = reviews.filter(function(review) {
    return (now - Date.parse(review.date)) / DAY < 4;
  });

  reviews.sort(function(a, b) {
    return Date.parse(a) - Date.parse(b);
  });

  return reviews;
};

var filterGood = function(reviews) {
  reviews = reviews.filter(function(review) {
    return review.rating >= 3;
  });

  reviews.sort(function(a, b) {
    return b.rating - a.rating;
  });

  return reviews;
};

var filterBad = function(reviews) {
  reviews = reviews.filter(function(review) {
    return review.rating < 3;
  });

  reviews.sort(function(a, b) {
    return a.rating - b.rating;
  });

  return reviews;
};

var filterPopular = function(reviews) {
  reviews.sort(function(a, b) {
    return b.review_usefulness - a.review_usefulness;
  });

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
