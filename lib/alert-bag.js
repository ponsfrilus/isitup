// A container of alerts.
// TODO : persist this.

var lastId = 0;


module.exports = function() {
    var myAlertBag = {};
    var alerts= [];
    var io = null;
    var sockets =[];
    myAlertBag.setIO = function (theIO) {
        io = theIO;
        io.on('connection', function (socket) {
            sockets.push(socket);
        });
    };

    var shakeSockets = function() {
        sockets.forEach(function (socket) {
            socket.broadcast.emit('refresh');
        })
    };

    myAlertBag.allAlerts = function () {
        var result= [];
        alerts.forEach(function (entry) {
            result.push({
                name: entry.url,
                alertId: entry.alertId,
                time: entry.time,
                details: entry.details
            });
        });
        return result;
    };
    myAlertBag.addAlert = function (url, details) {
        lastId += 1;
        alerts.push({
            url: url,
            details: details,
            alertId: lastId,
            time: Date.now()
        });
        shakeSockets();
    };
    myAlertBag.acknowledgeAlert = function (alertId) {
        alerts = alerts.filter(function (entry) {
           return (entry.alertId != alertId);
        });
        shakeSockets();
        return myAlertBag.allAlerts();
    };
    return myAlertBag;
};
