"use strict";

var assert = require('assert');
var pem = require('pem');
var crypto = require("crypto");

describe('', function() {

	it ('generate certificate files', function(done) {
				
		pem.createCertificate({days:1, selfSigned:true}, function(err, keys) {
			console.log(typeof keys.serviceKey, 'typeof keys.serviceKey');
			assert.equal(true, typeof keys.serviceKey != 'undefined' && typeof keys.certificate != 'undefined', 'failed to generate certificate files!');
			done();
		});

	});

	it ('encrypt by ssl rsa ', function(done) {
				
		var toEncrypt = "Wrote string content to 西部大区重庆市	杨先波";

		pem.createCertificate({days:1, selfSigned:true}, function(err, keys) {

			var privateKey = keys.serviceKey + '\n-----Expired At 2020-----';
			var publicKey = keys.certificate + '\n-----Expired At 2020-----';

			// can be write certificate files to disk and read then from utf8 character encode
			// var absolutePath = path.resolve('path to certificate file path');
   			// var publicKey = fs.readFileSync(absolutePath, "utf8");

	    	var buffer = new Buffer(toEncrypt);

    	    var encrypted = null;

		    try {
		    	encrypted = crypto.publicEncrypt(publicKey, buffer);
		    	encrypted = encrypted.toString("base64")
		    } catch(e) {
		    	assert.equal(true, e == null, e.message);
		    }

	    	assert.equal(true, encrypted != null, 'failed to encrypt');


    	    var toDecrypt = encrypted;
	    	var encrypt_buffer = new Buffer(toDecrypt, "base64");
	    	var decrypted = null;

		    try {
		    	decrypted = crypto.privateDecrypt(privateKey, encrypt_buffer);
		    	decrypted = decrypted.toString("utf8")
		    } catch(e) {
		    	assert.equal(true, e == null, e.message);
		    }

		    assert.equal(true, decrypted != null, 'failed to decrypt1');
		    assert.equal(true, decrypted === toEncrypt, 'failed to decrypt2');

			done();
		});

	});


});

