/**
 * Created by nborboen on 19.06.15.
 */
var request = require('request');
var websites = require('./config-monitoring.js').websites;

var pager_module = require("./pager");
/* define the pager mode : "prod" or "dev" */
var pager = new pager_module.Pager({mode: "dev",
    from: "epfl"});


var runonce = function(alertBag) {
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
};

module.exports.run = function(alertBag){
    setInterval(function(){runonce(alertBag)}, 20000);
};
