'use strict';

console.log('Rendering reviews');

var templateElement = document.querySelector('#review-template');
var reviewTemplate;
var reviewContainer = document.querySelector('.reviews-list');

if ('content' in templateElement) {
  reviewTemplate = templateElement.content.querySelector('.review');
} else {
  reviewTemplate = templateElement.querySelector('.review');
}

window.reviews.forEach(function(review) {
  var tempTemplate = reviewTemplate.cloneNode(true);

  var image = tempTemplate.querySelector('.review-author');
  var rate = tempTemplate.querySelector('.review-rating');
  var text = tempTemplate.querySelector('.review-text');

  var rates = ['two', 'three', 'four', 'five'];

  image.onerror = function() {
    console.log('adding class review-load-failure');
    tempTemplate.classList.add('review-load-failure');
  };

  image.src = review.author.picture;


  text.textContent = review.description;

  if(review.rating > 1 && review.rating < 6) {
    rate.classList.add('review-rating-' + rates[review.rating - 2]);
  }

  console.log('Append template');

  reviewContainer.appendChild(tempTemplate);
});

console.log('Done appending');
