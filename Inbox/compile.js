// This is the best practise for cross platform such as windows and linux.
const path = require('path');   
const fs = require('fs');
const solc = require('solc');

const inboxPath = path.resolve(__dirname,'contracts','Inbox.sol');
const source = fs.readFileSync(inboxPath,'utf8');

module.exports = solc.compile(source).contracts[':Inbox'];

//console.log(solc.compile(source).contracts[':Inbox']);