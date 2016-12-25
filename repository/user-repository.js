
var q = require('q');
var moment = require('moment');
var _ = require('underscore');


var _USER_KEY 	= 'users_';


function list(client) {
	return q.promise(function (resolve, reject, notify) {
		// HGETALL users_
		client.hgetall(_USER_KEY, function(err, object) {
			if (err) reject(err);
		    resolve(object == undefined ? {} : object);
		});
	});
}

function add(user, client) {
	return q.Promise(function (resolve, reject, notify) {
		var data = {};
		data[user.username]  = JSON.stringify(_.extend({join_date: moment().format('YYYY-MM-DD HH:mm:ss')}, user));
		client.hmset(_USER_KEY, data, function (err, ok) {
			if (err) reject(err);
			resolve(ok);
		});
	});
}

function remove(field_name, client) {
	// del users_ keesh.zhang
	return q.Promise(function (resolve, reject, notify) {
		client.del(_USER_KEY, field_name, function (err, affectRowCount) {
			if (err) reject(err);
			resolve(affectRowCount);
		});
	})
}


module.exports = {
	list: list,
	add: add,
	remove: remove
}