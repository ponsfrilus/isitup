/**
 * Created by nborboen on 27.03.15.
 */

// http://epnet.epfl.ch/responsables-informatiques
// https://github.com/langpavel/node-ping-wrapper


/**
 * Reflexion about usage
 *  - want to know if a web site is up
 *  - want to know if a web site is down
 *  - want to monitor a list of web site
 *  - want to receive mail and / or sms on alert
 *  - want to choose the interval of the check
 *
 *  Nice to have
 *  - different interval check in function of website
 *  - incremental alert (e.g. when website is up, no more alert, or only mail alert)
 *  - number of check to do
 *
 */


var request = require('request');
var websites = {
    "epfl": [{"url": "http://www.epfl.ch", "mode": "up"}],
    "google":[{"url":"http://www.google.ch","mode":"down"}]
};

var pager_module = require("./pager");
var pager = new pager_module.Pager("dev");

for (item in websites) {
    console.log(item);
    console.log(websites[item][0].url);
    websites[item].forEach(function (entry) {
        console.log(entry.url + ' ' + entry.mode);
        request
            .get(entry.url)
            .on('response', function (response) {
                console.log(entry.url + " " + response.statusCode);
                console.log(response.headers['content-type']);
                if (response.statusCode == 200) {
                    pager.send("ms content", function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Message sent: ' + info.response);
                        }
                    });
                }
            })
    });
};
