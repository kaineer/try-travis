// phantomjs/utils/emitter.js
//

var slice = Array.prototype.slice;
var log = require('./log.js');

var Emitter = module.exports = {
  on: function(name, callback) {
    this.__callbacks || (this.__callbacks = {});
    this.__callbacks[name] || (this.__callbacks[name] = []);

    this.__callbacks[name].push(callback);

    return this;
  },
  emit: function(name) {
    var callbacks = this.__callbacks[name] || [];
    var args = slice.call(arguments, 1);

    for(var i = 0; i < callbacks.length; ++i) {
      callbacks[i].apply(this, args);
    }
  }
};
