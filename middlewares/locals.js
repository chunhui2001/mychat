
var ObjectId    = require('bson-objectid');

module.exports = function (req, res, next) {
	if (req.user) res.locals.user = req.user; 
	res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.ticket = ObjectId.generate(); 
    next();
}