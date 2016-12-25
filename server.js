var express = require('express');
var http    = require('http');
var logger  = require('morgan');
var expressSession  = require('express-session');
var RedisStore      = require('connect-redis')(expressSession);
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var passport        = require('passport');

var redis = require('redis');
var fs = require('fs');
var ejs             = require('ejs');
var ejsLayouts      = require('express-ejs-layouts');
var favicon   = require('serve-favicon');
var path    = require('path');
var ObjectId    = require('bson-objectid');
var scHotReboot = require('sc-hot-reboot');
var environment = process.env.ENV || 'dev';




var authController      = require('./controllers/auth-controller');



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


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(ejsLayouts);

// middleware
var sessionMiddleware = expressSession({
  genid: function(req) {
    return ObjectId.generate() // use UUIDs for session IDs
  },
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized:false,
  cookie: { maxAge: 20000000 },
  store: new RedisStore({client: redis.createClient('redis://127.0.0.1:6379')})
});

app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) { 
    if (req.user) res.locals.user = req.user; 
    res.locals.ticket = ObjectId.generate(); 
    next();
});



app.get('/', authController.ensureAuthenticated, function (req, res) {
    res.render('index');
});

app.get('/login', function (req, res) {
    res.render('login')
});

app.post('/login', authController.authLocalCredentials, function(req, res) {
    console.log(res.locals, 'res.locals.user');
    if (req.isAuthenticated()) return res.redirect('/');
    res.redirect('/login');
});





function startServer(port) {   

    var defaultPort = 3000; 

    if (port) {
        var server = app.listen(0, 'localhost', function (argument) {
            console.log(`Your server in running on ${port || defaultPort}, ` + app.get('env'));
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
