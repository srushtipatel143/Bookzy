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
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },

            connectionTimeout: 60000,
            greetingTimeout: 30000,
            socketTimeout: 60000,

            tls: {
                rejectUnauthorized: false,
            },
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

