'use strict';

// https://github.com/squaremo/amqp.node
// http://localhost:15672/#/

var _REDIS_CONFIG = require('../config/config-main')['redis'];
var _REDIS_HOST = _REDIS_CONFIG['HOST'];
var _REDIS_PORT = _REDIS_CONFIG['PORT'];
var _REDIS_URI = _REDIS_CONFIG['REDIS_URI'];
var _REDIS_TICKET_NUMBER = _REDIS_CONFIG['DB_NUMBERS']['CINEMA_TICKET_NUMBER'];

var redis = require('redis');
var redisCinemaClient = redis.createClient(_REDIS_URI + '/' + _REDIS_TICKET_NUMBER);
var redisSessionClient = redis.createClient(_REDIS_URI);


module.exports = {
	REDIS_HOST: _REDIS_HOST,
	REDIS_PORT: _REDIS_PORT,
	REDIS_CINEMA_CLIENT: redisCinemaClient,
	REDIS_SESSION_CLIENT: redisSessionClient,
	REDIS_BASE_CLIENT: redis.createClient(_REDIS_URI)
}