// node module that provides cryptographic functionality
var crypto = require('crypto');

// generates random string for JTI
var generateJTI = function() {
    return crypto.randomBytes(20).toString('hex');
};

// generates the time for when the JWT will expire (59 seconds after created)
var generateExp = function() {
    var currentDate = new Date();
    currentDate = currentDate.getTime();
    var expiringTime = Math.floor((currentDate + 59000) / 1000);
    expiringTime = parseInt(expiringTime);
    return expiringTime;
}


module.exports = PayLoadInputs;

function PayLoadInputs(client_id, client_secret, ent_or_user_id, box_sub_type) {
    this.client_id = client_id;
    this.ent_or_user_id = ent_or_user_id;
    this.box_sub_type = box_sub_type;
    this.exp = generateExp();
    this.jti = generateJTI();
    this.aud = "https://api.box.com/oauth2/token"
    this.client_secret = client_secret;
};