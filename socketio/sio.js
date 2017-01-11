
var sio = require('socket.io');
var amqp = require('amqplib');
var sio_redis = require('socket.io-redis');
var redisClientSocket = require('redis').createClient('redis://127.0.0.1:6379/8');
var amqpClient = amqp.connect('amqp://localhost');

var UserRepo = require('../repository/user-repository');

var queue = 'ticket_event';

module.exports = function (server, sessionMiddleware) {

    var    io = sio(server); 

    io.adapter(sio_redis({ host: 'localhost', port: 6379 }));

    io.use(function (socket, next) {
        sessionMiddleware(socket.request, socket.request.res, next);
    });

    // redisClientSocket.subscribe(queue);

    // redisClientSocket.on('message', function (channel, message) {

    //     if (channel !== queue) return;

    //     var msg = JSON.parse(message);

    //     if (msg.to) {
    //         io.sockets.emit('ticket_status_change_' + msg.to, msg);
    //         delete msg.to;
    //     }

    //     io.sockets.emit('ticket_status_change', msg);

    // });

    // Consumer
    amqpClient.then(function(conn) {
      return conn.createChannel();
    }).then(function(ch) {
      return ch.assertQueue(queue).then(function(ok) {
        return ch.consume(queue, function(message) {
          if (message !== null) {
            console.log(message.content.toString(), 'receive a message');
            ch.ack(message);

            var msg = JSON.parse(message.content.toString());

            if (msg.to) {
                io.sockets.emit('ticket_status_change_' + msg.to, msg);
                delete msg.to;
            }

            io.sockets.emit('ticket_status_change', msg);
          }
        });
      });
    }).catch(console.warn);


    process.on('message', function(message, connection) {
        if (message !== 'sticky-session:connection')
            return;
        server.emit('connection', connection);
        connection.resume();
    });
    
    // write business code here
    io.sockets.on('connection', function (socket) {

        socket.on('set username', function(data, callback) {

            var username = data.username;
            var ticket = data.ticket;

            UserRepo.list(redisClient).done(function(list) {

                _USERS_LIST = list;
                
                if (_USERS_LIST[username]) {
                  return callback(false);
                }

                UserRepo.add({username: username, ticket: ticket}, redisClient).done(function(ok) {
                    
                });

                socket.username   = username;
                _USERS_LIST[username]   = socket;

                io.sockets.emit('user joined', Object.keys(_USERS_LIST));
                // socket.broadcast.emit('user joined', username);

                callback(true);

            });
            
        });


        socket.on('send message', function(data, callback) {

            var msg   = data.trim();

            if (msg.substring(0, 3) != '/w ') {
              io.sockets.emit('new message', {msg: data, username: socket.username});
              // socket.broadcast.emit('new message', data);
              return;
            }

            var msgTmp  = msg.replace(/\s+/, ' ');
            var toUser  = msgTmp.split(' ') [1];

            UserRepo.list(redisClient).done(function(userlist) {

                if (!userlist[toUser]) {
                  return callback('Wrong user name!');
                }

                var to_ticket = JSON.parse(userlist[toUser])['ticket'];
                var from_ticket = JSON.parse(userlist[socket.username])['ticket'];

                var idx = data.indexOf(toUser + ' ') + (toUser + ' ').length;

                io.sockets.emit('new message ' + to_ticket, {
                    msg: data.substring(idx).replace(new RegExp(/ /g),'&nbsp;'), 
                    username: socket.username + ' to ' + toUser
                });

                io.sockets.emit('new message ' + from_ticket, {
                    msg: data.substring(idx).replace(new RegExp(/ /g),'&nbsp;'), 
                    username: socket.username + ' to ' + toUser
                });

            });

        });

    });
 }


 // module.exports.run = run;