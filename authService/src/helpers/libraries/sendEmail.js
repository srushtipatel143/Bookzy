const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",

    // CHANGE THIS
    port: 2525,

    secure: false,

    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASS,
    },

    connectionTimeout: 120000,
    greetingTimeout: 60000,
    socketTimeout: 120000,

    requireTLS: true,

    tls: {
        rejectUnauthorized: false,
        minVersion: "TLSv1.2",
    },

    debug: true,
    logger: true,
});

try {
    await transporter.verify();
    console.log("SMTP Connected");
} catch (err) {
    console.log("MAIL ERROR:", err);
}

module.exports = sendEmail;

