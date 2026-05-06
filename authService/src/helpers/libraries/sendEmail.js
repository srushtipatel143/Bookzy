const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
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

const sendEmail = async (mailOptions) => {
    try {

        // verify smtp connection
        await transporter.verify();

        console.log("SMTP Connected");

        // send mail
        const info = await transporter.sendMail(mailOptions);

        console.log("Mail Sent:", info.messageId);

        return info;

    } catch (err) {

        console.log("MAIL ERROR:", err);

        throw err;
    }
};

module.exports = sendEmail;