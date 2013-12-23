var nodemailer = require('nodemailer');

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport('SMTP', require('smtpConfig'));

var mail = module.exports = {

};