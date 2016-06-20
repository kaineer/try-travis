'use strict';

var game = require('./game');

var formContainer = document.querySelector('.overlay-container');
var formOpenButton = document.querySelector('.reviews-controls-new');
var formCloseButton = document.querySelector('.review-form-close');

formOpenButton.onclick = function(evt) {
  evt.preventDefault();
  formContainer.classList.remove('invisible');
  game.enablePauseListener(false);
};

formCloseButton.onclick = function(evt) {
  evt.preventDefault();
  formContainer.classList.add('invisible');
  game.enablePauseListener(true);
};
