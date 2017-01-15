'use strict';

// https://github.com/squaremo/amqp.node
// http://localhost:15672/#/

var _AMQP_CONFIG = require('../config/config-main')['amqp'];

var amqp = require('amqplib');
var amqpClient = amqp.connect(_AMQP_CONFIG['AMQP_URI']);


module.exports = {
	AMQP_CLIENT: amqpClient,
	queues: {
		test_quene: 'tasks2',
		ticket_event: 'ticket_event'
	}
}