var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var conf = require('./../conf/config.js');
var config = conf.config;
var members = conf.members;


function epflMailTransporter() {
    return nodemailer.createTransport(smtpTransport({
        host: 'mail.epfl.ch'
    }));

}

function cloud9MailTransporter() {
    return {  sendMail: function (entry, cb) {
        console.log("false sendMail");
        cb(null,{
            response: "I did not actually send anything ;)",
            accepted: "I did not actually send anything ;)"
        });
    }}}
    
console.log('Members '+config);
/**
 * @param mode either "dev" or "prod"
 * @constructor
 */
var Pager = function (opts) {
    var to, cc;
    var sms_api = "."+config.sms_service_key+"@"+config.sms_plateform;
    var transporter;
    if (opts.from === "epfl") {
        console.log("transporter")
        transporter = epflMailTransporter();
    } else {
        transporter = cloud9MailTransporter();
    }

    if (opts.mode === "prod") {
        to = whosoncall().phone+sms_api; // z796094072.hydtodkom18@sms.epfl.ch, z766152580.hydtodkom18@sms.epfl.ch';
    } else {
        console.log('Members ' + whosoncall().phone);
        to = whosoncall().mail;
        cc = config.isitup_email;
    }
    return {
        send: function (entry, details, cb) {
            var mailOptions = {
                /**
                 * to - Comma separated list or an array of recipients e-mail addresses that will appear on the To: field
                 * cc - Comma separated list or an array of recipients e-mail addresses that will appear on the Cc: field
                 * bcc - Comma separated list or an array of recipients e-mail addresses that will appear on the Bcc: field
                 * replyTo - An e-mail address that will appear on the Reply-To: field
                 *  -> http://adilapapaya.com/docs/nodemailer/#emailmessagefields
                 */
                from: 'isitup@groupes.epfl.ch',
                subject: "[isitup] " + entry.url,
                text: details,
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
