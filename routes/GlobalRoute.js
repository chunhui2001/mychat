var GlobalRoute 	= require('express').Router();


var authController      = require('../controllers/auth-controller');

module.exports = function (argument) {
	
	"use strict";

	GlobalRoute.route('/')
		.get(authController.ensureAuthenticated, function (req, res) {
			res.render('index');
		});

	GlobalRoute.route('/logout')
		.get(authController.ensureAuthenticated, function (req, res) {
			req.logout();
			res.redirect('/');
		});

	GlobalRoute.route('/login')
		.get(function (req, res) {
			res.render('login', {curl: req.url});
		}).post(authController.authLocalCredentials, function (req, res) {

		    var b = req.query.b;

		    console.log(b, 'b');

		    if (req.isAuthenticated()) return res.redirect( b ? b : '/');

		    res.redirect('/login');
		})

	return GlobalRoute;
}