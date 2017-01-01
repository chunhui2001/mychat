"use strict";

var redis = require('redis');
var redisClient = redis.createClient('redis://127.0.0.1:6379/9');

var TicketQueneRepository = require('../repository/cinema/TicketQueneRepository');
var TicketQueneRepo = new TicketQueneRepository();

module.exports = {

	detail: function (req, res) {
		
		var movieId 	= req.params.movieId;	


		// key: cinemaId_roomId_date_time_moveId_seatId

		TicketQueneRepo.list(redisClient).done(function (ticket_list) {
			res.render('cinema/movie', {movieId: movieId, ticketList: ticket_list == null ? {} : ticket_list});
		});


		
	}
}