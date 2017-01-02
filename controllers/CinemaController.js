"use strict";

var redis = require('redis');
var redisClient = redis.createClient('redis://127.0.0.1:6379/9');

var TicketQueneRepository = require('../repository/cinema/TicketQueneRepository');
var TicketQueneRepo = new TicketQueneRepository();

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

		var ticketKeyList 	= req.body.ticketKeyList || [];

		if (ticketKeyList.length == 0) return res.json(0);

		// 1. delete ticket quene keys
		// 2. update ticket pool status

		// 1.
		TicketQueneRepo.remove(ticketKeyList, redisClient).done(function (affectRowCount) {
			res.json(affectRowCount);
		});

	}


}