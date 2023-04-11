const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports.sendMailToUser = async function (options) {
  return new Promise(function (resolve, reject) {
    const transporter = nodemailer.createTransport({
      host: "smtp.mailgun.org",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAILGUN_USERNAME,
        pass: process.env.MAILGUN_PASSWORD,
      },
    });

    transporter.sendMail(options, function (err, data) {
      if (err) {
        reject(err);
        console.log(err);
      } else {
        resolve(true);
      }
    });
  });
};