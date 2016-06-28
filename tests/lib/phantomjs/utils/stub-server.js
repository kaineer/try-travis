// Redirects:
/*
[
  {
    url: "https://fonts.googleapis.com/css?family=PT+Mono&subset=latin,cyrillic",
    file: "fonts.css"
  },
  {
    url: "https://fonts.gstatic.com/s/ptmono/v4/_YCFp79_jghtsQps06aA-w.ttf",
    file: "ptmono.ttf"
  }
]
*/

var config = require('../../config/index.js').phantomjs;
var log = require('./log.js');

var fs = require('fs');

var findRedirect = function(redirects, url) {
  var redirectUrl;

  for(var i = 0; i < redirects.length; ++i) {
    redirectUrl = redirect[i].redirect || redirect[i].file;

    if(url.indexOf(redirectUrl) > -1) {
      return redirects[i];
    }
  }

  return null;
};

var extname = function(path) {
  var md = /(\.\w+)$/.exec(path);

  if(md) {
    return md[1];
  } else {
    return null;
  }
};

var MIME_TYPES = {
  '.css' => 'text/css',
  '.json' => 'application/json',
  '.js'   => 'text/javascript'
};

var getMimeType = function(redirect) {
  var mime = redirect.mime || redirect.mimeType;
  var ext = extname(redirect.file);

  mime ||= MIME_TYPES[ext] || 'application/octet-stream';

  return mime;
};

var stubServer = function(redirects) {
  var server = require('webserver').create();

  server.listen(config.stubServer, function(request, response) {
    var redirect = findRedirect(redirects, request.url);
    var content;

    if(redirect.file && fs.exists(redirect.file)) {
      content = fs.read(redirect.file);

      response.statusCode = redirect.status || 200;
      response.setHeader('Content-Type', getMimeType(redirect));
      response.write(content);
      response.close();
    }
  });
};

module.exports = stubServer;
