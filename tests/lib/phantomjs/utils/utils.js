module.exports = {
  find: function(list, callback) {
    var length = list.length;
    for(var i = 0; i < length; ++i) {
      if(callback(list[i])) {
        return list[i];
      }
    }
    return null;
  }
};
