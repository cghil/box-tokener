// requiring dependencies

var jwt = require('jsonwebtoken'),
	fs = require('fs'),
	request = require('request'),
	crypto = require('crypto'),
	colors = require('colors'),
	argv = require('minimist')(process.argv.slice(2));

function PayLoadInputs(client_id, ent_or_user_id, box_sub_type){
	this.client_id = client_id;
	this.ent_or_user_id = ent_or_user_id;
	this.box_sub_type = box_sub_type;
	this.exp = generateExp();
	this.jti = generateJTI();
	this.aud = "https://api.box.com/oauth2/token"
};

function KeyInputs(filePath, keyId){
	this.privateKey = fs.readFileSync(path);
	this.publicKeyId = keyId;
}

// generates random string for JTI
function generateJTI(){
	return crypto.randomBytes(20).toString('hex');
};

// generates the time for when the JWT will expire (59 seconds after created)
function generateExp(){
	var currentDate = new Date();
	currentDate = currentDate.getTime();
	var expiringTime = Math.floor((currentDate + 59000) / 1000);
	expiringTime = parseInt(expiringTime);
	return expiringTime
};

function generateJWT(inputs){

};

function requestForAccessToken(signed_JWT, client_secret, client_id){
	var options = {
		method: "POST",
		url: "https://api.box.com/oauth2/token",
		headers: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		form: {
			grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
			client_id: client_id,
			client_secret: client_secret,
			assertion: signed_JWT
		}
	};

	request(options, responseHandler);

	function responseHandler(error, response, body){
		if(error) throw new Error(error);
	};
};

var inputs = new PayLoadInputs();
console.log(inputs)