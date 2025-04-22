const nodemailer = require('nodemailer');
require("dotenv").config();
const sendEmail = async (mailOptions) => {
    const { SMTP_HOST, SMTP_PORT, EMAIL_USERNAME, EMAIL_PASS } = process.env;
    let transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        auth: {
            user: EMAIL_USERNAME,
            pass: EMAIL_PASS
        },
        tls: { rejectUnauthorized: false }
    })
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log("Error is : ", error)
    }

}

module.exports = sendEmail;
