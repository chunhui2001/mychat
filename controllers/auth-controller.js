var passport    = require('passport');
var passportLocal   = require('passport-local');


passport.use(new passportLocal.Strategy(verifyCredentials));


passport.serializeUser(function (user, done) {
    console.log(user, 'serializeUser');
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    if (!user) return done(null, null);
    done(null, user);
})


function verifyCredentials(username, password, done) {
    console.log('verifyCredentials');       
    console.log(username, 'username');
    console.log(password, 'password');
    if (!username || !password) return done(true);
    if (username.length == 0 || password.length == 0) return done(true);


    return done(null, {username: username, passwd: password, id:10000});
}

exports.ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        // redirect to login page
        res.redirect('/login');
    }
}


exports.authLocalCredentials = function (req, res, next) {
    
    var loginUrl = '/login';

    if (req.user) {
        next();
        return;
    }

    passport.authenticate('local', function (err, user, info) {
        console.log(err, 'err');
        console.log(user, 'user');
        console.log(info, 'info');
        if (err) return next(err);
        if (!user) res.redirect(loginUrl);
        req.logIn(user, function (err) {
            if (err) return next(err);
            next();
        });
    })(req, res, next);
}