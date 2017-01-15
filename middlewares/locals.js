
var cookie = require('cookie');
var cookieSignature = require('cookie-signature');
var ObjectId    = require('bson-objectid');

module.exports = function (req, res, next) {
	if (req.user) res.locals.user = req.user; 

    console.log(res.locals.user, 'res.locals.user');

	res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.socketTicket = ObjectId.generate(); 

    if (req.headers.cookie) {
        var the_cookie = cookie.parse(req.headers.cookie)['kzhang'];
        if (the_cookie && the_cookie.substr(0, 2) === 's:') {  
            var sessionId = cookieSignature.unsign(the_cookie.slice(2), 'keyboard cat');                
            if (sessionId !== false) res.locals.sessionId = sessionId;
        }  
    }

    if (!res.locals.sessionId) {
        res.locals.sessionId = res.locals.socketTicket;
    } else res.locals.socketTicket = res.locals.sessionId;

    var req_headers = req['headers'];

    if (req_headers['accept'] && req_headers['accept'].indexOf('application/json') != -1) {

    	function SendResult (argument) {
    		this.error = false;
    		this.code = 200;
    		this.message = 'successful';
    		this.data = null;
    	}

    	SendResult.prototype = Object.create(SendResult.prototype);
    	SendResult.prototype.constructor = SendResult;

    	req.sendResult = new SendResult();
    }

    next();
}


