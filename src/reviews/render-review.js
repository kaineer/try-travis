'use strict';

var reviewTemplate;
var templateElement = document.getElementById('review-template');

if ('content' in templateElement) {
  reviewTemplate = templateElement.content.querySelector('.review');
} else {
  reviewTemplate = templateElement.querySelector('.review');
}

var renderReview = function(review) {
  var reviewElement = reviewTemplate.cloneNode(true);

  var image = reviewElement.querySelector('.review-author');
  var rate = reviewElement.querySelector('.review-rating');
  var text = reviewElement.querySelector('.review-text');

  var rates = ['two', 'three', 'four', 'five'];

  image.onerror = function() {
    reviewElement.classList.add('review-load-failure');
  };

  image.src = review.author.picture;

  text.textContent = review.description;

  if(review.rating > 1 && review.rating < 6) {
    rate.classList.add('review-rating-' + rates[review.rating - 2]);
  }

  return reviewElement;
};

module.exports = renderReview;
