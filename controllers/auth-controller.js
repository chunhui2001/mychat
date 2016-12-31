var passport    = require('passport');
var passportLocal   = require('passport-local');


passport.use(new passportLocal.Strategy({
    usernameField: 'username',
    passwordField: 'password'
  }, verifyCredentials));


passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    if (!user) return done(null, null);
    done(null, user);
})


function verifyCredentials(username, password, done) {
    if (!username || !password) return done(true);
    if (username.length == 0 || password.length == 0) return done(true);


    return done(null, {username: username, passwd: password, id:10000});
}

exports.ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } 

    var loginUri      = '/login';

    if (req.originalUrl != '/' && req.originalUrl != loginUri) {
        loginUri = loginUri + '?b=' + req.originalUrl.replace('/login?b=', '');
    }

    // redirect to login page
    res.redirect(loginUri);
}


exports.authLocalCredentials = function (req, res, next) {
    
    var loginUrl = '/login';

    if (req.user) {
        next();
        return;
    }

    passport.authenticate('local', function (err, user, info) {
        if (err) return next(err);
        if (!user) return res.redirect(loginUrl);
        req.logIn(user, function (err) {
            if (err) return next(err);
            next();
        });
    })(req, res, next);
}