'use strict';

var _AMQP_PROVIDER = require('../providers/AmqpProvider');
var amqpClient = _AMQP_PROVIDER['AMQP_CLIENT'];
var _TICKET_EVENT_QUEUE = _AMQP_PROVIDER['queues']['ticket_event'];

function publish (to, content) {

	var message = {
		to: to,
		content: content
	};

	var queue = _TICKET_EVENT_QUEUE;

	// RabbitMQ
	// Publisher
	amqpClient.then(function(conn) {
	  return conn.createChannel();
	}).then(function(ch) {
	  return ch.assertQueue(queue).then(function(ok) {
	    return ch.sendToQueue(queue, new Buffer(JSON.stringify(message)));
	  });
	}).catch(console.warn);
}

module.exports = {
	publish: publish
}