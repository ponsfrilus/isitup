var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var transporter = nodemailer.createTransport(smtpTransport({
    host: 'mail.epfl.ch'
}));


/**
 * @param mode either "dev" or "prod"
 * @constructor
 */
var Pager = function (mode) {
    var to;
    if (mode === "prod") {
        to = '0796094072.hydtodkom18@sms.epfl.ch';
    } else {
        to = 'nicolas.borboen@epfl.ch';
    }
    return {
        send: function (msg, cb) {
            var mailOptions = {
                from: 'nicolas.borboen@epfl.ch',
                subject: msg,
                text: msg,
                to: to
            };
            transporter.sendMail(mailOptions, cb);
        }
    };
};

module.exports.Pager = Pager;
