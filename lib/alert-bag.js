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

    myAlertBag.allAlerts = function () {
        var result= [];
        alerts.forEach(function (entry) {
            result.push({
                name: entry.url,
                alertId: entry.alertId,
                mode: entry.mode,
                time: entry.time
            });
        });
        return result;
    };
    myAlertBag.addAlert = function (entry) {
        lastId += 1;
        alerts.push({
            url: entry.url,
            mode: entry.mode,
            alertId: lastId,
            time: Date.now()
        });

        sockets.forEach(function (socket) {
            socket.broadcast.emit('refresh');
        })



    };
    myAlertBag.acknowledgeAlert = function (alertId) {
        alerts = alerts.filter(function (entry) {
           return (entry.alertId != alertId);
        });
        return myAlertBag.allAlerts();
    };
    return myAlertBag;
};
