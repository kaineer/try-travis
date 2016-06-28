// phantomjs/utils/resources.js
//

var Emitter = require('./emitter.js');
var log = require('./log.js');

var Resources = function Resources(page) {
  this.clear();
  this.bindToPage(page);
};

rp = Resources.prototype;

rp.on = Emitter.on;
rp.emit = Emitter.emit;

rp.bindToPage = function(page) {
  var resources = this;

  page.onResourceRequested = function(requestData, networkRequest) {
    resources.request(requestData);
    resources.emit('resource.requested', requestData, networkRequest, page);
  };

  page.onResourceReceived = function(response) {
    if(response.stage === 'end') {
      resources.emit('resource.received', response, page);
      resources.receive(response);

      if(resources.noRequestsLeft()) {
        resources.emit('resource.clean', page);
      }
    } else {
      resources.emit('resource.receiving', response, page);
    }
  };

  page.onResourceError = function(error) {
    resources.emit('resource.error', error, page);
    resources.abort(error);

    if(resources.noRequestsLeft()) {
      resources.emit('resource.clean', page);
    }
  };

  page.onResourceTimeout = function(request) {
    resources.abort(request);

    if(resources.noRequestsLeft()) {
      resources.emit('resource.clean', page);
    }
  };
};

rp.request = function(request) {
  this.resources[request.url] = 'REQUESTED';
};

rp.receive = function(response) {
  this.resources[response.url] = 'RECEIVED';
};

rp.abort = function(error) {
  this.resources[error.url] = 'ABORTED';
};

rp.clear = function() {
  this.resources = {};
};

rp.noRequestsLeft = function() {
  for(var key in this.resources) {
    if(this.resources[key] === 'REQUESTED') {
      return false;
    }
  }

  return true;
};

Resources.create = function(page) {
  return new Resources(page);
};

module.exports = Resources;
