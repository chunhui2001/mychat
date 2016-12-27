var express = require('express');
var http    = require('http');
var logger  = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var passport        = require('passport');

var fs = require('fs');
var ejs             = require('ejs');
var ejsLayouts      = require('express-ejs-layouts');
var favicon   = require('serve-favicon');
var path    = require('path');
var scHotReboot = require('sc-hot-reboot');


var environment = process.env.ENV || 'dev';

var app = new express();


if (environment != 'production') {
    console.log(`   !! The sc-hot-reboot plugin is watching for code changes in the ${__dirname} directory`);
    scHotReboot.attach(null, {
      cwd: __dirname,
      ignored: ['public', 'views', 'node_modules', 'README.md', '.gitignore', /[\/\\]\./]
    });

    app.use(logger('dev'));
}


app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon', 'siafu.ico')));


app.engine('.html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

var sessionMiddleware   = require('./middlewares/session.js');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(ejsLayouts);


app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(require('./middlewares/locals.js'));


app.use(require('./routes/GlobalRoute')());
app.use(require('./routes/CinemaRoute')());



function startServer(port) {   

    var defaultPort = 3000; 
    var server = null;

    if (port) {
        server = app.listen(0, 'localhost', function (argument) {
            console.log(`Your server in running on ${port || defaultPort}, ` + app.get('env'));
        });
    }

    if (!port) {

        server = http.createServer(app);
        server.listen(defaultPort, function() {
            console.log('Express server listening on port ' + defaultPort + ', ' + app.get('env'));
        });
    }

    require('./socketio/sio')(server, sessionMiddleware);
}


if (require.main == module) {
    startServer();
} else {
    module.exports = startServer;
}
