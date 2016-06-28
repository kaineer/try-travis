'use strict';

var reviews = [];
var slice = Array.prototype.slice;

var form = document.querySelector('.reviews-filter');
var rbGroup = form.elements.reviews;

var applyFilter = require('./apply-filter');

var filterReviews = function() {
  console.log('Filter: ' + rbGroup.value);
  applyFilter(rbGroup.value, slice.call(reviews));
  console.log('Filter done');
};

var displayReviews = function(data) {
  console.log('Reviews count: ' + data.length);

  reviews = data;

  form.addEventListener('click', filterReviews);

  filterReviews();
};

module.exports = displayReviews;
