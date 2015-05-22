var http = require('http'),
    fs = require('fs'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter,
    url = require('url'),

    statusCodes = http.STATUS_CODES;


/*
 IsItUp Constructor
 */
function IsItUp (opts) {
    // default http request method
    this.method = 'GET';

    // holds website to be monitored
    this.website = '';

    // ping intervals in minutes
    this.timeout = 15;

    // interval handler
    this.handle = null;

    // initialize the app
    this.init(opts);

    return this;
}


/*
 Inherit from EventEmitter
 */
util.inherits(IsItUp, EventEmitter);



/*
 Methods
 */

IsItUp.prototype.init = function (opts) {
    var timeout = opts.timeout || 15,
        website = opts.website;
    console.log('test');
    if (!website) {
        this.emit('error', {msg: 'You did not specify a website to monitor'});

        return;
    }

    this.method = opts.method || this.method;
    this.website = website;
    this.timeout = (timeout * (60 * 1000));

    // start monitoring
    this.start();
};

IsItUp.prototype.start = function () {
    var self = this,
        time = Date.now();

    console.log("\nMonitoring: " + self.website + "\nTime: " + self.getFormatedDate(time) + "\n");

    // create an interval for pings
    self.handle = setInterval(function () {
        self.ping();
    }, self.timeout);
};

IsItUp.prototype.stop = function () {
    clearInterval(this.handle);
    this.handle = null;

    this.emit('stop', this.website);
};

IsItUp.prototype.ping = function () {
    var self = this,
        currentTime = Date.now(),
        req,
        options = url.parse(self.website);

    options.method = this.method;
    req            = http.request(options, function (res) {

        // Website is up
        if (res.statusCode === 200) {
            self.isOk();
        }

        // No error but website not ok
        else {
            self.isNotOk(res.statusCode);
        }
    });

    req.on('error', function(err) {
        try {
            var data = self.responseData(404, statusCodes[404 +'']);
            self.emit('error', data);
        } catch (error) {
            console.log('Uncaught Error Event for ' + self.website, error);
            console.log('IsItUp stopped');
            self.stop();
        }
    });

    req.end();
};

IsItUp.prototype.isOk = function () {
    var data = this.responseData(200, 'OK');

    this.emit('up', data);
};

IsItUp.prototype.isNotOk = function (statusCode) {
    var msg = statusCodes[statusCode + ''],
        data = this.responseData(statusCode, msg);


    this.emit('down', data);
};

IsItUp.prototype.responseData = function (statusCode, msg) {
    var data = Object.create({}), time = Date.now();

    data.website = this.website;
    data.time = time;
    data.statusCode = statusCode;
    data.statusMessage = msg;

    return data;
};

IsItUp.prototype.getFormatedDate = function (time) {
    var currentDate = new Date(time);

    currentDate = currentDate.toISOString();
    currentDate = currentDate.replace(/T/, ' ');
    currentDate = currentDate.replace(/\..+/, '');

    return currentDate;
};

module.exports = IsItUp;

