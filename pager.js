var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var transporter = nodemailer.createTransport(smtpTransport({
    host: 'mail.epfl.ch'
}));
var conf = require('./config.js')
var config = conf.config;
var members = conf.members;


console.log('Members '+config);
/**
 * @param mode either "dev" or "prod"
 * @constructor
 */
var Pager = function (mode) {
    var to, cc;
    var sms_api = "."+config.sms_service_key+"@"+config.sms_plateform;


    if (mode === "prod") {
        to = whosoncall().phone+sms_api; // z796094072.hydtodkom18@sms.epfl.ch, z766152580.hydtodkom18@sms.epfl.ch';
    } else {
        console.log('Members ' + whosoncall().phone);
        to = whosoncall().mail;
        cc = config.isitup_email;
    }
    return {
        send: function (entry, cb) {
            if (entry.mode == "up") { var msg_txt = "[isitup] "+entry.url+" is up."; } else { var msg_txt = "[isitup] "+entry.url+" is down."; }
            var mailOptions = {
                /**
                 * to - Comma separated list or an array of recipients e-mail addresses that will appear on the To: field
                 * cc - Comma separated list or an array of recipients e-mail addresses that will appear on the Cc: field
                 * bcc - Comma separated list or an array of recipients e-mail addresses that will appear on the Bcc: field
                 * replyTo - An e-mail address that will appear on the Reply-To: field
                 *  -> http://adilapapaya.com/docs/nodemailer/#emailmessagefields
                 */
                from: 'nicolas.borboen@epfl.ch', // TODO: change for isitup@groupes.epfl.ch
                subject: "[isitup] "+entry.url+" ("+entry.mode+")",
                text:msg_txt,
                to: to,
                cc: cc
            };
            transporter.sendMail(mailOptions, cb);
        }
    };
};

function whosoncall() {
    var currentDate = new Date();
    var ts = conf.timesheet;
    
    return who(currentDate, ts);
}

function who(currentDate, ts)
{
    var member;
    ts.forEach(function (entry) {
        if (entry.date < currentDate) {
            member = entry.oncall;
        }
    });
    console.log(member.name);
    return member;
}
module.exports.Pager = Pager;
