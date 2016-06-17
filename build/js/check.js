function getMessage(a, b) {
  if(typeof(a) === 'boolean') {
    if(a) {
      return 'Я попал в ' + b;
    } else {
      return 'Я никуда не попал';
    }
  }

  if(typeof(a) === 'number') {
    return 'Я прыгнул на ' + (a * 100) + ' сантиметров';
  }
}
