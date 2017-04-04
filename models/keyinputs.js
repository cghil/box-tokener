// node module that provides file and directory access
var fs = require('fs');

module.exports = KeyInputs;

function KeyInputs(filePath, keyId, passphrase) {
    this.privateKey = fs.readFileSync(filePath);
    this.publicKeyId = keyId;
    this.passphrase = passphrase;
};