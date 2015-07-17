var express = require('express'),
    path = require('path'),
    io = require('socket.io'),
    passport = require('passport'),
    tequila = require('passport-tequila'),
    session = require('express-session'),
    FileStore = require('session-file-store')(session);


function myVerify(accessToken, refreshToken, profile, done) {
    // Pretend the verification is asynchronous (as would be required
    // e.g. if using a database):
    process.nextTick(function () {
        done(null, profile);
    });
}
// Use the TequilaStrategy within Passport.
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (obj, done) {
    done(null, obj);
});
var tequilaStrategy = new tequila.Strategy({
        service: "Is it up ?",
        request: ["displayname"]
        // require: "group=openstack-sti",  // Uncomment and use a group you are a member of.
    }, myVerify);
passport.use(tequilaStrategy);

var alertSource = require('./lib/monitor-websites');
var alertBag = require('./lib/alert-bag')();

var app = express();
app.set('view engine', 'jade');

app.use(session({
    secret: 'keybo@rd catsdmflksdmfk',
    store: new FileStore()
}));
app.use(passport.initialize());
app.use(passport.session());

function ensureAuthenticatedJSON(req, res, next) {
    if (req.user) {
        next();
    } else {
        serveJSONError(res, "Not authenticated");
    }
}

function serveJSONError(res, reason) {
    res.json({
        error: reason
    });
}

app.use(express.static(path.join(__dirname, "./app")));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use (require('body-parser').json());

app.get('/api/alerts', ensureAuthenticatedJSON, function(req, res) {
    res.json(alertBag.allAlerts());
});
app.post('/api/acknowledgement', tequilaStrategy.ensureAuthenticated, function(req, res) {
    res.json(alertBag.acknowledgeAlert(req.body.alertId));
});

// This is how you Tequila-protect a page:
app.get('/private', tequilaStrategy.ensureAuthenticated, function(req, res){
    res.write("Private page");
    res.render('index');
    //res.render('private', { user: req.user });
});

// User gets redirected here upon clicking on the "login" button.
// We could do that smarter (e.g. iframe the Tequila into a
// translucent overlay), but we won't.
app.get("/login", tequilaStrategy.ensureAuthenticated, function (req, res) {
    res.redirect("/");
});

// To log out, just drop the session cookie.
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

// Alternatively, we can also log out from Tequila altogether.
app.get('/globallogout', tequilaStrategy.globalLogout("/"));

app.get('*', function(req, res, next){
    res.render('index');
});

alertSource.run(alertBag);

var origListen = app.listen;
app.listen = function() {
    var server = origListen.apply(app, arguments);
    alertBag.setIO(io(server));
    return server;
};

module.exports = app;
