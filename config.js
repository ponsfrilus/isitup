/* Global config */
var config = {
    sms_service_key: 'hydtodkom18',
    sms_plateform: 'sms.epfl.ch',
    isitup_email: 'isitup@groupes.epfl.ch'
}
exports.config = config;

/* member's data */
var members = {
    nbo: {
        name:   'Nicolas Borboën',
        mail:   'nicolas.borboen@epfl.ch',
        phone:  '0766152580'
    },
    dom: {
        name:   'Dominique Quatravaux',
        mail:   'dominique.quatravaux@epfl.ch',
        phone:  '0796094072'
    }
};
exports.members = members;

/* on call timesheet */
var timesheet = [
    {
        date: new Date("May 25, 2015 00:00:00"),
        oncall: members.dom
    },
    {
        date: new Date("May 27, 2015 12:00:00"),
        oncall: members.nbo
    },
    {
        date: new Date("May 27, 2015 13:50:00"),
        oncall: members.dom
    },
    {
        date: new Date("May 30, 2015 00:00:00"),
        oncall: members.dom
    },
    {
        date: new Date("May 31, 2015 00:00:00"),
        oncall: members.nbo
    },
    {
        date: new Date("Jun 1, 2015 00:00:00"),
        oncall: members.dom
    }];

exports.timesheet = timesheet;