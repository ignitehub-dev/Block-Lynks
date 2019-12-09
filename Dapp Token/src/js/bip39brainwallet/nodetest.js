let bip = require("./script/index.js.js");

// pass in argument on running  = node nodetest.js test
var args = process.argv.slice(2);
let newPhrase = bip.getbip39seeds(args[0]);

// or just set a passphrase in the code
// let newPhrase = bip.getbip39seeds('test')

console.log("--------------------------------------------------------------");
console.log("passed in argument: " + args[0]);
console.log("returned phrase: " + newPhrase);
console.log("--------------------------------------------------------------");
