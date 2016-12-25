var GlobalRoute 	= require('express').Router();


var authController      = require('../controllers/auth-controller');

module.exports = function (argument) {
	
	"use strict";

	GlobalRoute.route('/')
		.get(authController.ensureAuthenticated, function (req, res) {
			res.render('index');
		});


	GlobalRoute.route('/login')
		.get(function (req, res) {
			res.render('login');
		}).post(authController.authLocalCredentials, function (req, res) {
		    if (req.isAuthenticated()) return res.redirect('/');
		    res.redirect('/login');
		})

	return GlobalRoute;
}