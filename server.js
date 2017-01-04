var express = require('express');
var http    = require('http');
var logger  = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var passport        = require('passport');
var onFinished = require('on-finished');

var fs = require('fs');
var ejs             = require('ejs');
var ejsLayouts      = require('express-ejs-layouts');
var favicon   = require('serve-favicon');
var path    = require('path');
var scHotReboot = require('sc-hot-reboot');

var NotFoundError = require('./errors/NotFoundError');


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

var _TicketJob = require('./cronjobs/TicketCronJob')().start();


app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon', 'siafu.ico')));


app.engine('.html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

var sessionMiddleware   = require('./middlewares/session.js');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(require('compression')());
app.use(require('response-time')());
app.use(cookieParser());
app.use(ejsLayouts);


app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(require('./middlewares/locals.js'));

app.use(function (req, res, next) {
    onFinished(res, function (err) {
        console.log("[%s] finished request", req.connection.remoteAddress);
    });
    next();
});

app.use(require('./routes/GlobalRoute')());
app.use(require('./routes/CinemaRoute')());



app.use(function (req, res, next) {
    res.status(404);
    res.type('text/plain');
    next(new NotFoundError("404"));
});



app.use(require('./errors/ErrorsHandle'));







function startServer(port) {   

    var defaultPort = 3001; 
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
