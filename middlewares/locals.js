
var ObjectId    = require('bson-objectid');

module.exports = function (req, res, next) {
	if (req.user) res.locals.user = req.user; 

	res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.socketTicket = ObjectId.generate(); 

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