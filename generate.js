
var fs = require('fs');

var f = encodeURIComponent(fs.readFileSync(process.argv[2]))
console.log("javascript:" + f);

