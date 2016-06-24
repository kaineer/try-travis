'use strict';

var renderReview = require('./render-review');
var container = document.querySelector('.reviews-list');

var renderReviews = function(reviews) {
  container.innerHTML = '';

  reviews.forEach(function(review) {
    var reviewElement = renderReview(review);
    container.appendChild(reviewElement);
  });
};

module.exports = renderReviews;
