var CinemaRoute 	= require('express').Router();


var authController      = require('../controllers/auth-controller');

module.exports = function (argument) {
	
	"use strict";

	CinemaRoute.route('/cinema')
		.get(authController.ensureAuthenticated, function (req, res) {
			res.render('cinema/index');
		});

	return CinemaRoute;
}