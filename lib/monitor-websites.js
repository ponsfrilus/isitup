/**
 * Created by nborboen on 19.06.15.
 */
var request = require('request');
var checks = {
    ensureUp: function (url, done_cb) {
        request
            .get(url)
            .on('response', function (response) {
                console.log("Testing " + url);
                console.log(" └ "+ url + " " + response.statusCode);
                console.log(" └ "+response.headers['content-type']);
                if (response.statusCode == 200) {
                    done_cb();
                } else {
                    done_cb({
                        details: "responded with unexpected code " + response.statusCode,
                        httpStatus: response.statusCode
                    });
                }
            })
            .on('error', function (error) {
                console.log("Error testing " + url) + ": "  + String(error);
                done_cb({
                    details: "is unreachable",
                    error: error
                });
            });
    }
};
var websites = require('./../conf/config-monitoring.js').websites(checks);

var pager_module = require("./../lib/pager");
/* define the pager mode : "prod" or "dev" */
var pager = new pager_module.Pager({mode: "dev",
    from: "epfl"});

function sendAlert(pager, alertBag, entry, details) {
    pager.send(entry, details, function (error, info) {
        if (error) {
            console.log('Error sending message for '+entry.url+" Error info: " +error);
        } else {
            console.log('Message sent for '+entry.url+" Response info: " + info.response +" ("+ info.accepted+")");
        }
    });
    alertBag.addAlert(entry.url, details);
}

var runonce = function(alertBag) {
    for (item in websites) {
        websites[item].forEach(function (entry) {
            var url = entry.url,
                check = entry.check;
            check(url, function (MayBeError) {
                if (MayBeError) {
                    var details = url + ": " + MayBeError.details;
                    sendAlert(pager, alertBag, entry, details);
                }
            });
        });
    };
};

module.exports.run = function(alertBag){
    runonce(alertBag);
    runonce(alertBag);
    runonce(alertBag);
    setInterval(function(){runonce(alertBag)}, 20000);
};
