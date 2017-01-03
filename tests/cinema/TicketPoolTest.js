var assert = require('assert');
var path = require('path');
var moment = require('moment');
var fs = require('fs');
var redis = require('redis');
var nimble = require('nimble');

var redisClient = redis.createClient('redis://127.0.0.1:6379/9');

var ticket_pool = path.join(__dirname, '../../repository/cinema/ticket_pool.json');

var TicketPoolRepository = require('../../repository/cinema/TicketPoolRepository');
var TicketPoolRepo = new TicketPoolRepository();


describe('Ticket Pool Test', function(){


	"use strict";


	it('Check Ticket Pool File Exists', function(done){

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

	// it('Check a Ticket Exists', function (done) {
		
	// 	var key = "c62479_005_20170101_19:40_CNXJ0056301_FR1A01#02";

	// 	TicketPoolRepo.exists(key, redisClient).done(function (exists) {
	// 		assert.equal( true, exists, "["+key+"]: not exists!");
	// 		done();
	// 	});

	// });

	it('Add a new Ticket', function (done) {
		
		var key = "c62479_005_20170101_19:40_CNXJ0056301_FR1A01#02";
		var value 	= { "name":"变形精钢5", "status": "pending", "price": "45.00", "social_from": "", "pay_way": "", "pay_time": "", "expiredAt" : "", "gen_no": "" };

		TicketPoolRepo.add(key, value, redisClient).done(function (ok) {
			assert.equal( 'OK', ok);
			done();
		});

	});



	it('#Add all Tickets to Pool', function (done) {
		
		var content = fs.readFileSync(ticket_pool);
		var json_data = JSON.parse(new String(content).toString());

		nimble.series([
	    	function(callback) {
		        TicketPoolRepo.delHash(redisClient).done(function (affectRowCount) {
					assert.equal(true, affectRowCount > 0);
					callback();
				});
		    },
		    function(callback) {	
				Object.keys(json_data).forEach(function (key) {
					var all_status = ['pending', 'locked', 'saled'];
					var ticketValue = json_data[key];
					ticketValue.status = all_status[Math.floor(Math.random()*(all_status.length)+1)-1];
					ticketValue.key = key;
					TicketPoolRepo.add(key, ticketValue, redisClient).done(function (ok) {
						assert.equal( 'OK', ok);
					});
				});

				callback();
		    },
		    function (callback) {
		    	TicketPoolRepo.list(redisClient).done(function (ticket_list) {
					assert.equal( true, Object.keys(ticket_list).length > 0, "did not add any ticket to pool");					
					callback();
				}, function (err) {
					callback();
				});
		    }, 
		    function (callback) {
		    	done();
		    }
		]);	

	});

	it ('#get list get key', function(done) {

		var keys = ['c62479_005_20170101_19:40_CNXJ0056301_FR1A01#01'];
		keys.push('c62479_005_20170101_19:40_CNXJ0056301_FR1A01#02');
		TicketPoolRepo.listByKey(keys, redisClient).done(function(tickets) {
			console.log(tickets, '#get list get key, tickets');
			assert.equal(true, tickets.length == keys.length);
			done();
		});

	});

});