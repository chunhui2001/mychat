"use strict";

var moment = require('moment');
var redis = require('redis');
var amqp = require('amqplib');
var redisClient = redis.createClient('redis://127.0.0.1:6379/9');
var redisClientSocket = redis.createClient('redis://127.0.0.1:6379/8');
var amqpClient = amqp.connect('amqp://localhost');

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
			// throw new Error("ddd22");
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
			if (keyArr[keyArr.length - 1] != 'pending') 
				throw new InvalidRequestError();

			keyArr.pop();
			ticketPoolKeyList.push(keyArr.join('_'));
		});

		// 1.
		TicketQueneRepo.remove(ticketQueneKeyList, redisClient).done(function (affectRowCount) {

			// [!!!] if affectRowCount == 0 that means the tickets is locked by other users
			if (req.sendResult) {
				if (affectRowCount == ticketQueneKeyList.length) {
					req.sendResult.data = ticketQueneKeyList;
					req.sendResult.message = ticketQueneKeyList.map(
						function (key) { var keyarr = key.split('_'); keyarr.pop(); return keyarr.join('_') + '_locked'; }).join(',') + ' are locked';
				} else {
					req.sendResult.error = true;
					req.sendResult.message = 'failed';
				}
				
				res.json(req.sendResult);
			}
			

			if (affectRowCount != ticketQueneKeyList.length) return;


			// 2.
			TicketPoolRepo.listByKey(ticketPoolKeyList, redisClient).done(function(tickets) {

				var keys_pool = [];
				var values_pool = [];

				// 更新状态 pending to locked
				tickets.forEach(function(ticket) {
					ticket = JSON.parse(ticket);
					ticket.status= 'locked';
					ticket.expiredAt = parseInt(moment().add(25, 'minutes').format('x'));
					keys_pool.push(ticket.key);
					values_pool.push(JSON.stringify(ticket));
				});

				console.log(values_pool, 'values_pool');

				TicketPoolRepo.update(keys_pool, values_pool, redisClient).done(function (ok) {
					// TODO.
					// 将状态变化广播出去
					var message = {
						to: res.locals.socketTicket,
						content: values_pool.map(function (ticket) { return { key: JSON.parse(ticket).key, status: JSON.parse(ticket).status}; })
					};


					var queue = 'ticket_event';

					// 在多进程环境下会发送多次, 考虑切换到 RabbitMQ
					// TODO. 
					// redisClientSocket.publish(queue, JSON.stringify(message));

					// Publisher
					amqpClient.then(function(conn) {
					  return conn.createChannel();
					}).then(function(ch) {
					  return ch.assertQueue(queue).then(function(ok) {
					    return ch.sendToQueue(queue, new Buffer(JSON.stringify(message)));
					  });
					}).catch(console.warn);

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

				// var unixTimespan = parseInt(moment().add(25, 'minutes').format('x'));
				// console.log(moment(unixTimespan).format('YYYY-MM-DD HH:mm:ss.SSS'), 'unixTimespan');

				TicketQueneRepo.add(keys_quene, values_quene, redisClient).done(function () {
					console.log('update ticket queue successful~');
				});

			});

		});

	}


}