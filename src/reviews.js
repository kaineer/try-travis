'use strict';

var reviewsUrl = '//o0.github.io/assets/json/reviews.json';

var templateElement = document.querySelector('#review-template');
var reviewTemplate;
var reviewContainer = document.querySelector('.reviews-list');

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

window.reviews.forEach(function(review) {
  var tempTemplate = reviewTemplate.cloneNode(true);

  var image = tempTemplate.querySelector('.review-author');
  var rate = tempTemplate.querySelector('.review-rating');
  var text = tempTemplate.querySelector('.review-text');

  var rates = ['two', 'three', 'four', 'five'];

  image.onerror = function() {
    tempTemplate.classList.add('review-load-failure');
  };

  image.src = review.author.picture;


  text.textContent = review.description;

  if(review.rating > 1 && review.rating < 6) {
    rate.classList.add('review-rating-' + rates[review.rating]);
  }

  reviewContainer.appendChild(tempTemplate);
});
