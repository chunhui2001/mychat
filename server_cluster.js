var cluster = require('cluster'),
    net = require('net'),
    sio = require('socket.io'),
    sio_redis = require('socket.io-redis');


var args = process.argv.slice(2);
var number = args[0];
var port = number ? 300+number : 3001;

var num_processes = require('os').cpus().length;

if (cluster.isMaster) {

    var workers = [];

    var spawn = function(i) {
        workers[i] = cluster.fork();
        console.log('CLUSTER: Worker %d started', workers[i].id);
        workers[i].on('exit', function(code, signal) {
            console.log('respawning worker', i);
            spawn(i);
        });
    };

    for (var i = 0; i < num_processes; i++) {
        spawn(i);
    }

    var worker_index = function(ip, len) {
        var s = '';
        for (var i = 0, _len = ip.length; i < _len; i++) {
            if (!isNaN(ip[i])) {
                s += ip[i];
            }
        }

        return Number(s) % len;
    };

    var server = net.createServer({ pauseOnConnect: true }, function(connection) {
        var worker = workers[worker_index(connection.remoteAddress, num_processes)];
        worker.send('sticky-session:connection', connection);        
    }).listen(port);

} else {
    require('./server.js')(port);
}