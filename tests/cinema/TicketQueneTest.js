var assert = require('assert');
var path = require('path');
var moment = require('moment');
var fs = require('fs');
var redis = require('redis');
var redisClient = redis.createClient('redis://127.0.0.1:6379/9');

var TicketQueneRepository = require('../../repository/cinema/TicketQueneRepository');
var TicketQueneRepo = new TicketQueneRepository();


describe('Ticket Quene Test', function(){


	"use strict";


	it('Check a Ticket Exists', function (done) {
		
		var key = "c62479_005_20170101_19:40_CNXJ0056301_FR1A05#04_pending";

		TicketQueneRepo.exists(key, redisClient).done(function (exists) {
			assert.equal( true, exists, "["+key+"]: not exists!");
			done();
		});

	});

	// it('Add a new Ticket', function (done) {
		
	// 	var key = "c62479_005_20170101_19:40_CNXJ0056301_FR1A01#02";
	// 	var value 	= { "name":"变形精钢5", "status": "pending", "price": "45.00", "social_from": "", "pay_way": "", "pay_time": "", "expiredAt" : "", "gen_no": "" };

	// 	TicketQueneRepo.add(key, value, redisClient).done(function (ok) {
	// 		assert.equal( 'OK', ok);
	// 		done();
	// 	});

	// });



	// it('Add all Tickets to Quene', function (done) {
		
	// 	var content = fs.readFileSync(ticket_Quene);
	// 	var json_data = JSON.parse(new String(content).toString());

	// 	Object.keys(json_data).forEach(function (key) {
	// 		TicketQueneRepo.add(key, json_data[key], redisClient).done(function (ok) {
	// 			assert.equal( 'OK', ok);
	// 		});
	// 	});

	// 	TicketQueneRepo.list(redisClient).done(function (ticket_list) {
	// 		assert.equal( true, Object.keys(ticket_list).length > 0, "did not add any ticket to Quene");
	// 		done();
	// 	});

	// });

});