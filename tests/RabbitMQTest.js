'use strict';

// https://github.com/squaremo/amqp.node
// http://localhost:15672/#/

var amqp = require('amqplib');
var amqpClient = amqp.connect('amqp://localhost');

var queue = 'tasks2';


// Publisher
amqpClient.then(function(conn) {
  return conn.createChannel();
}).then(function(ch) {
  return ch.assertQueue(queue).then(function(ok) {
    return ch.sendToQueue(queue, new Buffer('something to do'));
  });
}).catch(console.warn);

// Consumer
amqpClient.then(function(conn) {
  return conn.createChannel();
}).then(function(ch) {
  return ch.assertQueue(queue).then(function(ok) {
    return ch.consume(queue, function(msg) {
      if (msg !== null) {
        console.log(msg.content.toString(), 'receive a message');
        ch.ack(msg);
      }
    });
  });
}).catch(console.warn);