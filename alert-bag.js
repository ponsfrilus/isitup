// A container of alerts.
// TODO : persist this.

var lastId = 0;

module.exports = function() {
    var myAlertBag = {};
    var alerts= [];

    myAlertBag.allAlerts = function () {
        var result= [];
        alerts.forEach(function (entry) {
            result.push({
                name: entry.url,
                alertId: entry.alertId
            });
        });
        return result;
    };
    myAlertBag.addAlert = function (entry) {
        lastId += 1;
        alerts.push({
            url: entry.url,
            mode: entry.mode,
            alertId: lastId
        });
    };
    myAlertBag.acknowledgeAlert = function (alertId) {
        alerts = alerts.filter(function (entry) {
           return (entry.alertId != alertId);
        });
        return myAlertBag.allAlerts();
    };
    return myAlertBag;
};
