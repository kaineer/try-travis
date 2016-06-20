'use strict';

var game = require('./game');

var formContainer = document.querySelector('.overlay-container');
var formOpenButton = document.querySelector('.reviews-controls-new');
var formCloseButton = document.querySelector('.review-form-close');
var formSubmitButton = document.querySelector('.review-submit');

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

var initValidation = function() {
  var form = document.querySelector('.review-form');
  var elems = form.elements,
    marks = elems['review-mark'],
    name = elems['review-name'],
    text = elems['review-text'],
    labels = form.querySelector('.review-fields'),
    labelName = form.querySelector('.review-fields-name'),
    labelText = form.querySelector('.review-fields-text'),
    i;

  name.required = true;

  var toggleVisibility = function(elem, flag) {
    elem.classList[(flag ? 'remove' : 'add')]('invisible');
  };

  var validateForm = function() {
    var descriptionRequired = +marks.value < 3;
    var formIsValid = name.validity.valid && text.validity.valid;

    text.required = descriptionRequired;
    toggleVisibility(labelName, !name.validity.valid);
    toggleVisibility(labelText, !text.validity.valid);
    toggleVisibility(labels, !formIsValid);

    formSubmitButton.disabled = !formIsValid;
  };

  for(i = 0; i < marks.length; i++) {
    marks[i].onclick = validateForm;
  }

  name.oninput = validateForm;
  text.oninput = validateForm;

  validateForm();
};

initValidation();
