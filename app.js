/**
 * Created by nborboen on 27.03.15.
 */


var request = require('request');
var websites = {
    /**
     * "website": [{"url": "http://www.ebsi.te", "mode": "up"}],
     *   Note:
     *       - mode "up" send message if statusCode == 200
     *       - mode "down" send message if statusCode != 200
     **/
    "epfl": [{"url": "http://www.epfl.ch", "mode": "up"}],
    "google": [{"url": "http://www.google.ch", "mode": "down"}]
};

var pager_module = require("./pager");
/* define the pager mode : "prod" or "dev" */
var pager = new pager_module.Pager("dev");

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
                }
            })
    });
};
