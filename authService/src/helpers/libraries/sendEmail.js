const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (mailOptions) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASS,
            },
            connectionTimeout: 10000,
        });
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw error;
    }
};

module.exports = sendEmail;