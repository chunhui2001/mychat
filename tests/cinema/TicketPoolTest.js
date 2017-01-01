var assert = require('assert');
var path = require('path');
var moment = require('moment');
var fs = require('fs');
var redis = require('redis');
var redisClient = redis.createClient('redis://127.0.0.1:6379/9');

var ticket_pool = path.join(__dirname, '../../repository/cinema/ticket_pool.json');

var TicketPoolRepository = require('../../repository/cinema/TicketPoolRepository');
var TicketPoolRepo = new TicketPoolRepository();


describe('Ticket Pool Test', function(){


	"use strict";


	it('Generate Ticket Pool by File', function(done){

		// assert.equal(true, fs.existsSync(ticket_pool));

		// fs.readFile(ticket_pool, function (err, content) {
		// 	console.log(content);
		// 	done();
		// });

		var content = fs.readFileSync(ticket_pool);
		var json_data = JSON.parse(new String(content).toString());
		assert.equal(true, Object.keys(json_data).length > 0, '电影票池无数据， 将不会插入任何数据!');

		done();

	});

	it('Check a Ticket Exists', function (done) {
		
		var key = "c62479_005_20170101_19:40_CNXJ0056301_FR1A01#02";

		TicketPoolRepo.exists(key, redisClient).done(function (exists) {
			assert.equal( true, exists, "["+key+"]: not exists!");
			done();
		});

	});

	it('Add a new Ticket', function (done) {
		
		var key = "c62479_005_20170101_19:40_CNXJ0056301_FR1A01#02";
		var value 	= { "name":"变形精钢5", "status": "pending", "price": "45.00", "social_from": "", "pay_way": "", "pay_time": "", "expiredAt" : "", "gen_no": "" };

		TicketPoolRepo.add(key, value, redisClient).done(function (ok) {
			assert.equal( 'OK', ok);
			done();
		});

	});



	it('Add all Tickets to Pool', function (done) {
		
		var content = fs.readFileSync(ticket_pool);
		var json_data = JSON.parse(new String(content).toString());

		Object.keys(json_data).forEach(function (key) {
			TicketPoolRepo.add(key, json_data[key], redisClient).done(function (ok) {
				assert.equal( 'OK', ok);
			});
		});

		TicketPoolRepo.list(redisClient).done(function (ticket_list) {
			assert.equal( true, Object.keys(ticket_list).length > 0, "did not add any ticket to pool");
			done();
		});

	});

});