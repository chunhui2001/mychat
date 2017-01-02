var CinemaRoute 	= require('express').Router();


var authController      = require('../controllers/auth-controller');
var cinemaController    = require('../controllers/CinemaController');

module.exports = function (argument) {
	
	"use strict";

	CinemaRoute.route('/cinema/')
		.get(authController.ensureAuthenticated, function (req, res) {
			var cinemaId 	= req.params.cinemaId;			
			// key: cinemaId_roomId_date_time_moveId_seatId
			res.render('cinema/index', {cinemaId: cinemaId});
		});


	CinemaRoute.route('/cinema/:movieId')
		.get(authController.ensureAuthenticated, cinemaController.detail);


	CinemaRoute.route('/cinema/:movieId')
		.post(authController.ensureAuthenticated, cinemaController.createOrder);

	return CinemaRoute;
}