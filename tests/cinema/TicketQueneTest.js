var assert = require('assert');
var path = require('path');
var moment = require('moment');
var fs = require('fs');
var nimble = require('nimble');
var redis = require('redis');
var redisClient = redis.createClient('redis://127.0.0.1:6379/9');

var TicketPoolRepository = require('../../repository/cinema/TicketPoolRepository');
var TicketQueneRepository = require('../../repository/cinema/TicketQueneRepository');
var TicketPoolRepo = new TicketPoolRepository();
var TicketQueneRepo = new TicketQueneRepository();


describe('Ticket Quene Test', function(){


	"use strict";


	// it('#Check a Ticket Exists', function (done) {
		
	// 	// var key = "c62479_005_20170101_19:40_CNXJ0056301_FR1A05#04_locked";
	// 	var key = "c62479_005_20170101_19:40_CNXJ0056301_FR1A01#01_pending";
	// 	var key = "c62479_005_20170101_19:40_CNXJ0056301_FR1A01#01_locked";

	// 	TicketQueneRepo.exists(key, redisClient).done(function (exists) {
	// 		assert.equal( true, exists, "["+key+"]: not exists!");
	// 		done();
	// 	});

	// });

	// it('#update a Ticket ', function (done) {
		
	// 	var key = "c62479_005_20170101_19:40_CNXJ0056301_FR1A01#01_locked";

	// 	TicketQueneRepo.get(key, redisClient).done(function (ticket) {
	// 		assert.equal( true,	ticket != null, "["+key+"]: not exists!");
	// 		var newTicket = JSON.parse(ticket);
	// 		// newTicket.status = 'pending';
	// 		TicketQueneRepo.update(key, newTicket, redisClient).done(function (ok) {
	// 			assert.equal('OK', ok, "["+key+"]: update failed!");
	// 			done();
	// 		});			
	// 	});

	// });

	it ('从票池中取出所有票，根据状态推入 待售、锁定、已售', function (done) {		

		nimble.series([
	    	function(callback) {
		        TicketQueneRepo.delHash(redisClient).done(function (affectRowCount) {
					assert.equal(true, affectRowCount >= 0);
					callback();
				});
		    },
		    function (callback) {
		    	TicketPoolRepo.list(redisClient).done(function (ticket_list) {					
					Object.keys(ticket_list).forEach(function (ticketKey) {						
						var ticket = JSON.parse(ticket_list[ticketKey]);
						var theTicketKey = ticketKey + "_" + ticket.status;
						TicketQueneRepo.add(theTicketKey, ticket, redisClient).done(function (ok) {
							assert.equal('OK', ok);
						});
					});
					callback();
				});
		    }, 
		    function (callback) {
		    	done();
		    }
		]);	

	});



	it ('listByPattern', function (done) {	
		TicketQueneRepo.listByPattern('c62479_005_20170101_*', redisClient).done(function (ticket_list) {
			console.log(ticket_list, 'ticket_list');
			assert.equal(true, Object.keys(ticket_list).length >= 0);
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




});