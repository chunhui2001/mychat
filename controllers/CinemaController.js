"use strict";

var redis = require('redis');
var redisClient = redis.createClient('redis://127.0.0.1:6379/9');

var InvalidRequestError = require('../errors/InvalidRequestError');

var TicketPoolRepository = require('../repository/cinema/TicketPoolRepository');
var TicketQueneRepository = require('../repository/cinema/TicketQueneRepository');

var TicketQueneRepo = new TicketQueneRepository();
var TicketPoolRepo = new TicketPoolRepository();

module.exports = {

	detail: function (req, res) {
		
		var movieId 	= req.params.movieId;	


		// key: cinemaId_roomId_date_time_moveId_seatId

		// TicketQueneRepo.error().done(function (argument) {
			
		// }, function (argument) {
		// 	throw new Error("ddd22");
		// });

		

		TicketQueneRepo.list(redisClient).done(function (ticket_list) {

			// c62479_005_20170101_19:40_CNXJ0056301_FR1A03#04_pending

			var seatMap = {};

			Object.keys(ticket_list).forEach(function (key) {
				
				var keyArray = key.split('_');
				var seatLetLan = keyArray[5];
				var row = seatLetLan.substring(4,6);
				var col = seatLetLan.substring(7,9);

				if (!seatMap[row]) seatMap[row] = {};
				if (!seatMap[row][col]) seatMap[row][col] = { seatKey:key, status: keyArray[keyArray.length-1]};

			});


			res.render('cinema/movie', {movieId: movieId, ticketList: ticket_list == null ? {} : ticket_list, seatMap: seatMap});
		});
		
	},

	createOrder: function (req, res) {

		var ticketQueneKeyList 	= req.body.ticketKeyList || [];
		var ticketPoolKeyList = [];

		if (ticketQueneKeyList.length == 0) return res.json(0);

		// validate ticket keys status is pending
		// 1. delete ticket quene keys
		// 2. update ticket pool status

		ticketQueneKeyList.forEach(function(key) {
			var keyArr = key.split('_');
			if (keyArr[keyArr.length - 1] != 'pending') {
				throw new InvalidRequestError();
				// return next(new InvalidRequestError());
			}
			keyArr.pop();
			ticketPoolKeyList.push(keyArr.join('_'));
		});

		// 1.
		TicketQueneRepo.remove(ticketQueneKeyList, redisClient).done(function (affectRowCount) {

			// [!!!] if affectRowCount == 0 that means the tickets is locked by other users
			res.json(affectRowCount);

			if (affectRowCount != ticketQueneKeyList.length) return;


			// 2.
			TicketPoolRepo.listByKey(ticketPoolKeyList, redisClient).done(function(tickets) {

				var keys_pool = [];
				var values_pool = [];

				// 更新状态 pending to locked
				tickets.forEach(function(ticket) {
					ticket = JSON.parse(ticket);
					ticket.status= 'locked';
					keys_pool.push(ticket.key);
					values_pool.push(JSON.stringify(ticket));
				});

				TicketPoolRepo.update(keys_pool, values_pool, redisClient).done(function (ok) {
					console.log('ok1');
				});


				var keys_quene = [];
				var values_quene = [];
				// 
				tickets.forEach(function(ticket) {
					ticket = JSON.parse(ticket);
					ticket.status = 'locked';
					ticket.key = ticket.key + '_' + ticket.status;
					keys_quene.push(ticket.key);
					values_quene.push(JSON.stringify(ticket));
				});

				TicketQueneRepo.add(keys_quene, values_quene, redisClient).done(function () {
					console.log('ok2');
				});

			});

		});

	}


}