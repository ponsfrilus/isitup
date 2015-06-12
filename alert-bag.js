// A container of alerts.
// TODO : persist this.

var lastId = 0;

module.exports = function() {
    var myAlertBag = {};
    var alerts= [];

    myAlertBag.allAlerts = function () {
        var result= [];
        alerts.forEach(function (entry) {
            result.push({name:entry.url});
        });
        return result;
    };
    myAlertBag.addAlert = function (entry) {
        lastId += 1;
        entry.uid = lastId;
        alerts.push(entry);
    };
    myAlertBag.acknowledgeAlert = function (entry) {
        alerts.pop(entry);
    };
    return myAlertBag;
};
