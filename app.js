var express = require('express');
var path = require('path');
var alertBag = require('./alert-bag')();

var app = express();

app.use(express.static(path.join(__dirname, "./app")));

app.get('/api/alerts', function(req, res) {
    res.json(alertBag.allAlerts());
});
app.post('/api/acknowledgement', function(req, res) {
    res.json(alertBag.acknowledgeAlert());
});




var request = require('request');
var websites = require('./config-monitoring.js').websites;

var pager_module = require("./pager");
/* define the pager mode : "prod" or "dev" */
var pager = new pager_module.Pager({mode: "dev",
                                    from: "epfl"});

for (item in websites) {
    websites[item].forEach(function (entry) {
        request
            .get(entry.url)
            .on('response', function (response) {
                console.log("Testing "+entry.url + ' in mode ' + entry.mode);
                console.log(" └ "+entry.url + " " + response.statusCode);
                console.log(" └ "+response.headers['content-type']);
                if (response.statusCode == 200 && entry.mode === "up") {
                    pager.send(entry, function (error, info) {
                        if (error) {
                            console.log('Error sending message sent for '+entry.url+" Error info: " +error);
                        } else {
                            console.log('Message sent for '+entry.url+" Response info: " + info.response +" ("+ info.accepted+")");
                        }
                    });
                    alertBag.addAlert(entry);
                }
            })
    });
};

var port = process.env.PORT || 3000;
app.set('port', port);

var server = app.listen(app.get('port'), function() {
    process.stdout.write("App ready on port " + port);
});

