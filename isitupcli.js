/**
 * Created by nborboen on 27.03.15.
 */


// usage: node ./example.js [IP] [timeout in seconds]

//var Ping = require('./ping');
var Ping = require('ping-wrapper');

// load configuration from file 'config-default-' + process.platform
// Only linux is supported at the moment
Ping.configure();


var ping = new Ping(process.argv[2] || '127.0.0.1');

console.log('process.argv[2]', process.argv[2]);

ping.on('ping', function(data){
    console.log('Ping %s: time: %d ms', data.host, data.time);
});

ping.on('fail', function(data){
    console.log('Fail', data);
});


if (process.argv[3]) {
    setTimeout(function() {
        ping.stop();
    }, process.argv[3] * 1000);
}

// later you can call ping.stop()