// requiring dependencies

var jwt = require('jsonwebtoken'),
	fs = require('fs'),
	request = require('request'),
	crypto = require('crypto'),
	colors = require('colors'),
	argv = require('minimist')(process.argv.slice(2));

function JWTinputs(client_id, client_secret, ent_or_user_id, box_sub_type, password){
	this.client_id = client_id;
	this.ent_or_user_id = ent_or_user_id;
	this.box_sub_type = box_sub_type;
	this.password = password;
	this.exp = generateExp();
	this.jti = generateJTI();
	this.aud = "https://api.box.com/oauth2/token"
};

// generates random string for JTI
function generateJTI(){
	return crypto.randomBytes(20).toString('hex');
};

// generates the time in which the JWT will expire
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

}

var inputs = new JWTinputs();
console.log(inputs)