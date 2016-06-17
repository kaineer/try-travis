var spawn = require('child_process').spawn;

var phantomjs = spawn('phantomjs', ['--version']);

phantomjs.stdout.on('data', function(data) {
  var text = data.toString();
  console.log(text);
});

phantomjs.stderr.on('data', function(data) {
  var text = data.toString();
  console.log(text);
});

phantomjs.on('exit', function(code) {
  process.exit(code);
});
