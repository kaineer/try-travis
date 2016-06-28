'use strict';

//
var reviewsJsonUrl = '//o0.github.io/assets/json/reviews.json';
var reviews = document.querySelector('.reviews');

var getReviews = function(callback) {

 // 1. Загрузите данные из файла //o0.github.io/assets/json/reviews.json по XMLHttpRequest.
 // 2. Пока длится загрузка файла, покажите прелоадер,
 //    добавив класс .reviews-list-loading блоку .reviews.
 // 3. Когда загрузка закончится, покажите список отзывов, как в предыдущем задании.
 // 4. Если загрузка закончится неудачно (ошибкой сервера или таймаутом),
 //    покажите предупреждение об ошибке, добавив блоку .reviews класс reviews-load-failure.

  var xhr = new XMLHttpRequest();

  xhr.open('GET', reviewsJsonUrl, true);

  xhr.onloadstart = function() {
    reviews.classList.add('reviews-list-loading');
  };

  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status !== 200) {
        reviews.classList.add('reviews-load-failure');
        console.log('Could not get reviews: ' + JSON.stringify(xhr));
        console.log(xhr.responseText);
      } else {
        reviews.classList.remove('reviews-list-loading');
        reviews.classList.remove('reviews-load-failure');

        console.log('Got reviews');

        var loadedJSON = JSON.parse(xhr.responseText);
        callback(loadedJSON);
      }
    }
  };

  xhr.send();
};

module.exports = getReviews;
