var fs = require('fs');
var child_process = require('child_process');
var spawn = child_process.spawn;
var execSync = child_process.execSync;

var branchFileName = './branch-name';
var branchName;

if(process.env.TRAVIS === 'true') {
  // read branchName
  branchName = fs.readFileSync(branchFileName).toString();
} else {
  // get branchName, store into file
  branchName = execSync('git rev-parse --abbrev-ref HEAD').toString();
  fs.writeFileSync(branchFileName, branchName);
}

console.log(branchName);

process.exit(0);
