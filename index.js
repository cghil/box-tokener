// requiring dependencies

var jwt = require('jsonwebtoken'),
// signing and coding JWTs
    fs = require('fs'),
// node module that provides file and directory access
    request = require('request'),
// client for HTTP requests
    crypto = require('crypto'),
// node module that provides cryptographic functionality
    colors = require('colors'),
// allows for methods to color in the console
    argv = require('minimist')(process.argv.slice(2));
// allows for inputs from user

function PayLoadInputs(client_id, client_secret, ent_or_user_id, box_sub_type) {
    // generates random string for JTI
    function generateJTI() {
        return crypto.randomBytes(20).toString('hex');
    };

    // generates the time for when the JWT will expire (59 seconds after created)
    function generateExp() {
        var currentDate = new Date();
        currentDate = currentDate.getTime();
        var expiringTime = Math.floor((currentDate + 59000) / 1000);
        expiringTime = parseInt(expiringTime);
        return expiringTime
    };

    this.client_id = client_id;
    this.ent_or_user_id = ent_or_user_id;
    this.box_sub_type = box_sub_type;
    this.exp = generateExp();
    this.jti = generateJTI();
    this.aud = "https://api.box.com/oauth2/token"
    this.client_secret = client_secret;
};

function KeyInputs(filePath, keyId, passphrase) {
    this.privateKey = fs.readFileSync(filePath);
    this.publicKeyId = keyId;
    this.passphrase = passphrase;
};

var app = app || {};

app.tokenMaker = (function() {
	// creating the JWT
    function generateJWT(payload, keyInfo) {
        var signed_token = jwt.sign({
            iss: payload.client_id,
            sub: payload.ent_or_user_id,
            box_sub_type: payload.box_sub_type,
            aud: payload.aud,
            jti: payload.jti,
            exp: payload.exp
        }, { key: keyInfo.privateKey, passphrase: keyInfo.passphrase }, { algorithm: 'RS256', noTimestamp: true, header: { kid: keyInfo.publicKeyId } });
        return { signed_token: signed_token, client_id: payload.client_id, client_secret: payload.client_secret };
    };
    // making a request to Box services to get an access token with the JWT
    function requestForAccessToken(signed_JWT, client_secret, client_id) {
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

        app.consoleController.printJWT(signed_JWT);

        function responseHandler(error, response, body) {
            if (error) throw new Error(error);
            var body = JSON.parse(body);
            app.consoleController.printResponseBoby(body);
        };
    };

    return {
        jwtGenerator: function(payload, keyInfo) {
            return generateJWT(payload, keyInfo);
        },
        accessTokenCreator: function(inputs) {
            requestForAccessToken(inputs.signed_token, inputs.client_secret, inputs.client_id);
        }
    };
})();

app.consoleController = (function() {
    var tokenIdentifier = function() {
        if (argv.user_id != undefined || argv.U != undefined) {
            var user_id = argv.user_id || argv.U;
            var box_sub_type = 'user';
            return { id: user_id, box_sub_type: box_sub_type };
        } else {
            var enterprise_id = argv.enterprise_id || argv.E;
            var box_sub_type = 'enterprise';
            return { id: enterprise_id, box_sub_type: box_sub_type };
        }
    };


    function bodyResponsePrinter(body) {
        console.log('JSON response from server'.green);
        console.log(body);
        console.log('--------------------------------');
        console.log(' ');
        console.log(colors.red('Access Token: %s'), body.access_token);
        console.log(' ');
    };

    function JWTPrinter(token) {
        console.log(' ');
        console.log('Encoded JWT'.blue);
        console.log(token);
        console.log('--------------------------------');
        console.log(' ');
    };

    var help = function() {
        console.log(' ');
        console.log('This tool uses Box JWTs to ' + 'create access tokens for App Auth.');
        console.log(' ')
        console.log('These are the following options.'.underline);
        console.log('-C or --client_id'.blue + ' : API key for Box Platform');
        console.log('-E or --enterprise_id'.blue + ' : ID of the enterprise');
        console.log('-U or --user_id'.blue + ' : ID of the App User');
        console.log('-P or --passphrase'.blue + ' : secret for the JWT signing. Must match PEM');
        console.log('-S or --client_secret'.blue + ': client secret that pairs with client id');
        console.log('-Q or --public_key_id'.blue + ': the public key id found in developer console');
        console.log('-K or --path_private_key'.blue + ': file path to private key');
        console.log(' ');
    };

    var errorArgHandler = function() {
        console.log(' ');
        console.log('Unable to generate token. '.red + 'Please check arguements.')
        console.log('Use --help or -H for instructions');
        console.log(' ');
    };

    var argumentParser = function(callback) {
        var client_id = argv.C || argv.client_id;
        var client_secret = argv.S || argv.client_secret;
        var passphrase = argv.P || argv.passphrase;
        var privateKey = argv.K || argv.path_private_key;
        var publicKeyId = argv.Q || argv.public_key_id;

        if (argv.H || argv.help) {
            help();
        } else if (client_id && client_secret && passphrase && privateKey && publicKeyId) {
            var typeOfToken = tokenIdentifier();
            var box_sub_type = typeOfToken.box_sub_type;
            var ent_or_user_id = typeOfToken.id.toString();
            var payloadInputs = new PayLoadInputs(client_id, client_secret, ent_or_user_id, box_sub_type);
            var keyInputs = new KeyInputs(privateKey, publicKeyId, passphrase);
            jwt = callback(payloadInputs, keyInputs);
            return jwt
        } else {
            errorArgHandler();
        }
    };

    return {
        start: function(callback) {
            return argumentParser(callback);
        },

        printResponseBoby: function(body){
        	return bodyResponsePrinter(body);
        },

        printJWT: function(token){
        	return JWTPrinter(token);
        }
    };
})();

app.start = function() {
    var inputs = app.consoleController.start(app.tokenMaker.jwtGenerator);
    if (inputs) {
        app.tokenMaker.accessTokenCreator(inputs);
    }
};

app.start();