var express = require('express');
var path = require('path');
var alertBag = require('./alert-bag')();
var alertSource = require('./monitor-websites');

var app = express();

app.use(express.static(path.join(__dirname, "./app")));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use (require('body-parser').json());

app.get('/api/alerts', function(req, res) {
    res.json(alertBag.allAlerts());
});
app.post('/api/acknowledgement', function(req, res) {
    res.json(alertBag.acknowledgeAlert(req.body.alertId));
});



alertSource.run(alertBag);

var port = process.env.PORT || 3000;
app.set('port', port);

var server = app.listen(app.get('port'), function() {
    process.stdout.write("App ready on port " + port);
});

