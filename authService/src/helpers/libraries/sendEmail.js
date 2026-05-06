const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (mailOptions) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
            connectionTimeout: 30000,
        });

        await transporter.verify();
        console.log("SMTP Connected");

        await transporter.sendMail(mailOptions);

        console.log("Email Sent");
    } catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports = sendEmail;