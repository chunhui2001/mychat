

var redis = require('redis');
var expressSession  = require('express-session');
var RedisStore      = require('connect-redis')(expressSession);
var ObjectId    	= require('bson-objectid');

module.exports = expressSession({
	genid: function(req) {
		return ObjectId.generate() 
	},
	// key: 'kzhang',
	name: 'kzhang',
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized:false,
	cookie: { maxAge: 60 * 1000 * 20 },
	store: new RedisStore({client: redis.createClient('redis://127.0.0.1:6379')})
});