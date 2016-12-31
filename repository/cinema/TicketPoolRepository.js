
var q = require('q');
var moment = require('moment');
var _ = require('underscore');


var _TICKET_POOL_KEY 	= 'ticket_pool_';

function add(ticket_key, value, client) {
	// 1. check ticket not exists
	// 2. if not exists and then add new
	return q.Promise(function (resolve, reject, notify) {
		var ticket = {};
		ticket[ticket_key] = typeof value === 'Object' ? value : JSON.stringify(value);
		client.hmset(_TICKET_POOL_KEY, ticket, function (err, ok) {
			if (err) return reject(err);
			resolve (ok);
		});
	});
}

function exists(key, client) {
	return q.Promise(function (resolve, reject, notify) {
		client.hmget(_TICKET_POOL_KEY, key, function (err, val) {
			if (err) return reject(err);
			return resolve(val[0]!==null);
		});
	});
}

function list(client) {
	return q.Promise(function (resolve, reject, notify) {
		client.hgetall(_TICKET_POOL_KEY, function (err, Object) {
			if (err) return reject(err);
			return resolve(Object);
		});
	});
}


module.exports = {
	add: add,
	exists: exists,
	list: list
}