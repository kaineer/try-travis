'use strict';

var reviews = [];
var slice = Array.prototype.slice;

var form = document.querySelector('.reviews-filter');
var rbGroup = form.elements.reviews;

var applyFilter = require('./apply-filter');

var filterReviews = function() {
  applyFilter(rbGroup.value, slice.call(reviews));
};

var displayReviews = function(data) {
  reviews = data;

  form.addEventListener('click', filterReviews);

  filterReviews();
};

module.exports = displayReviews;
