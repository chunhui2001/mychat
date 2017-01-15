

var redis = require('redis');
var expressSession  = require('express-session');
var RedisStore      = require('connect-redis')(expressSession);
var ObjectId    	= require('bson-objectid');
var redisClient = require('../providers/RedisProvider')['REDIS_SESSION_CLIENT'];

module.exports = expressSession({
	genid: function(req) {
		return ObjectId.generate() 
	},
	// key: 'kzhang',
	name: 'kzhang',
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized:false,
	cookie: { maxAge: 60 * 1000 * 200 },
	store: new RedisStore({client: redisClient})
});