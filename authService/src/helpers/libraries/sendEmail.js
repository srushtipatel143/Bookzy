const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (mailOptions) => {
    try {
        console.log({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASS,
        });
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
    } catch (error) {
        console.error("MAIL ERROR:", error);
        throw error;
    }
};

module.exports = sendEmail;

