var express = require('express');
var http    = require('http');

var fs = require('fs');
var ejs             = require('ejs');
var ejsLayouts      = require('express-ejs-layouts');
var favicon   = require('serve-favicon');
var path    = require('path');
var ObjectId    = require('bson-objectid');
var scHotReboot = require('sc-hot-reboot');
var environment = process.env.ENV || 'dev';

if (environment != 'production') {
    console.log(`   !! The sc-hot-reboot plugin is watching for code changes in the ${__dirname} directory`);
    scHotReboot.attach(null, {
      cwd: __dirname,
      ignored: ['public', 'views', 'node_modules', 'README.md', '.gitignore', /[\/\\]\./]
    });
}


var app = new express();


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






function startServer(port) {   

    var defaultPort = 3000; 

    if (port) {
        var server = app.listen(0, 'localhost', function (argument) {
            console.log(`Your server in running on ${port || defaultPort}.`);
        });
    }

    if (!port) {

        server = http.createServer(app);
        server.listen(defaultPort, function() {
            console.log('Express server listening on port ' + defaultPort + ', ' + app.get('env'));
        });
    }

    require('./socketio/sio').run(server);
}


if (require.main == module) {
    startServer();
} else {
    module.exports = startServer;
}
