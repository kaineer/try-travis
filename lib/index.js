// var spawn = require('child_process').spawn;

// var phantomjs = spawn('phantomjs', ['--version']);

// phantomjs.stdout.on('data', function(data) {
//   var text = data.toString();
//   console.log(text);
// });

// phantomjs.stderr.on('data', function(data) {
//   var text = data.toString();
//   console.log(text);
// });

// phantomjs.on('exit', function(code) {
//   process.exit(code);
// });

var fs = require('fs');
fs.writeFileSync('./piece-of-text.txt', "Hello, everyone");
var text = fs.readFileSync('./piece-of-text.txt').toString();
console.log(text);
process.exit(0);
