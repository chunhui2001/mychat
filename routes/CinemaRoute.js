var CinemaRoute 	= require('express').Router();


var authController      = require('../controllers/auth-controller');

module.exports = function (argument) {
	
	"use strict";

	CinemaRoute.route('/cinema/:cinemaId')
		.get(authController.ensureAuthenticated, function (req, res) {
			var cinemaId 	= req.params.cinemaId;			
			// key: cinemaId_roomId_date_time_moveId_seatId
			res.render('cinema/index', {cinemaId: cinemaId});
		});

	return CinemaRoute;
}