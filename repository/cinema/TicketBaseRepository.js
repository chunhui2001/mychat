"use strict";

var q = require('q');
var moment = require('moment');
var _ = require('underscore');

var NotExistsError = require('../../errors/NotExistsError');

function TicketBaseRepository () {

}


TicketBaseRepository.prototype.error = function (argument) {

	return q.Promise(function (resolve, reject, notify) {
		if (1==1) {
			throw new Error("ddd");
		}
		
		return resolve(val[0]!==null);
	});

	
}

TicketBaseRepository.prototype.hashKey = function () {
	throw new Error('TicketBaseRepository#hashKey must be overridden by subclass');
}

TicketBaseRepository.prototype.add = function (ticket_key, value, client) {
	var _this = this;
	// 1. check ticket not exists
	// 2. if not exists and then add new
	return q.Promise(function (resolve, reject, notify) {
		var ticket = {};
		// console.log(value, 'newTicket');
		ticket[ticket_key] = typeof value === 'object' ? JSON.stringify(value) : value;
		client.hmset(_this.hashKey(), ticket, function (err, ok) {
			if (err) return reject(err);
			resolve (ok);
		});
	});
}


TicketBaseRepository.prototype.update = function (ticket_key, value, client) {
	var _this = this;
	return q.Promise(function (resolve, reject, notify) {
		_this.exists(ticket_key, client).done(function (exists) {			
			if (!exists) return reject(new NotExistsError());
			_this.add(ticket_key, value, client).done(function (ok) {
				return resolve(ok)
			});
		});
	});	
}

TicketBaseRepository.prototype.exists = function (field_name, client) {
	var _this = this;
	return q.Promise(function (resolve, reject, notify) {
		_this.get(field_name, client).done(function (ticket) {
			return resolve(ticket != null);
		});
	});	
}

TicketBaseRepository.prototype.list = function (client) {

	var _this = this;
	return q.Promise(function (resolve, reject, notify) {
		client.hgetall(_this.hashKey(), function (err, Object) {
			if (err) return reject(err);
			return resolve(Object);
		});
	});
}

TicketBaseRepository.prototype.get = function (field_name, client) {
	var _this = this;
	return q.Promise(function (resolve, reject, notify) {
		client.hmget(_this.hashKey(), field_name, function (err, val) {
			if (err) return reject(err);
			return resolve(val[0]);
		});
	});
}

TicketBaseRepository.prototype.delHash = function (client) {
	var _this = this;
	return q.Promise(function (resolve, reject, notify) {
		client.del(_this.hashKey(), function (err, affectRowCount) {
			if (err) reject(err);
			resolve(affectRowCount);
		});
	});
}

TicketBaseRepository.prototype.remove = function (field_name_arr, client) {
	var _this = this;
	return q.Promise(function (resolve, reject, notify) {
		client.hdel(_this.hashKey(), field_name_arr, function (err, affectRowCount) {
			if (err) reject(err);
			resolve(affectRowCount);
		});
	});
}

TicketBaseRepository.prototype = Object.create(TicketBaseRepository.prototype);
TicketBaseRepository.prototype.constructor = TicketBaseRepository;


module.exports = TicketBaseRepository;