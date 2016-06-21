'use strict';

var templateElement = document.querySelector('#review-template');
var reviewTemplate;

if ('content' in templateElement) {
  reviewTemplate = templateElement.content.querySelector('.review');
} else {
  reviewTemplate = templateElement.querySelector('.review');
  reviewTemplate.style.display = 'none';
}

window.reviews.forEach(function(review) {
});
