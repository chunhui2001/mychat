var express = require('express'),
    cluster = require('cluster'),
    net = require('net'),
    sio = require('socket.io'),
    sio_redis = require('socket.io-redis');


var args = process.argv.slice(2);
var number = args[0];
var port = number ? 300+number : 3001;

var num_processes = require('os').cpus().length;

if (cluster.isMaster) {
    // This stores our workers. We need to keep them to be able to reference
    // them based on source IP address. It's also useful for auto-restart,
    // for example.
    var workers = [];

    // Helper function for spawning worker at index 'i'.
    var spawn = function(i) {
        workers[i] = cluster.fork();

        console.log('CLUSTER: Worker %d started', workers[i].id);

        // Optional: Restart worker on exit
        workers[i].on('exit', function(code, signal) {
            console.log('respawning worker', i);
            spawn(i);
        });
    };

    // Spawn workers.
    for (var i = 0; i < num_processes; i++) {
        spawn(i);
    }

    // Helper function for getting a worker index based on IP address.
    // This is a hot path so it should be really fast. The way it works
    // is by converting the IP address to a number by removing non numeric
  // characters, then compressing it to the number of slots we have.
    //
    // Compared against "real" hashing (from the sticky-session code) and
    // "real" IP number conversion, this function is on par in terms of
    // worker index distribution only much faster.
    var worker_index = function(ip, len) {
        var s = '';
        for (var i = 0, _len = ip.length; i < _len; i++) {
            if (!isNaN(ip[i])) {
                s += ip[i];
            }
        }

        return Number(s) % len;
    };

    // Create the outside facing server listening on our port.
    var server = net.createServer({ pauseOnConnect: true }, function(connection) {
        // We received a connection and need to pass it to the appropriate
        // worker. Get the worker for this connection's source IP and pass
        // it the connection.
        var worker = workers[worker_index(connection.remoteAddress, num_processes)];
        worker.send('sticky-session:connection', connection);
    }).listen(port);
} else {

    var ejs             = require('ejs');
    var ejsLayouts      = require('express-ejs-layouts');
    var favicon   = require('serve-favicon');
    var path    = require('path');
    var ObjectId    = require('bson-objectid');
    var redis = require('redis');

    var app = new express();
    var server = app.listen(0, 'localhost'),
        io = sio(server);



    var UserRepo = require('./repository/user-repository');



    var redisClient = redis.createClient('redis://127.0.0.1:6379');


    app.use(express.static(path.join(__dirname, 'public')));
    app.use(favicon(path.join(__dirname, 'public', 'favicon', 'siafu.ico')));


    app.engine('.html', ejs.renderFile);
    app.set('view engine', 'html');
    app.set('views', path.join(__dirname, 'views'));


    app.use(ejsLayouts);


    app.use(function(req, res, next) { 
        res.locals.user = {username: 'keesh.zhang'};
        res.locals.ticket = ObjectId.generate(); 
        next();
    });

    app.get('/', function (req, res) {
        res.render('index');
    });



    io.adapter(sio_redis({ host: 'localhost', port: 6379 }));

    process.on('message', function(message, connection) {
        if (message !== 'sticky-session:connection') {
            return;
        }
        server.emit('connection', connection);
        connection.resume();
    });
    
    //这里写你的业务代码
    io.on('connection', function (socket) {

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