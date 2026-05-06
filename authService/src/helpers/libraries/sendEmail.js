// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const sendEmail = async (mailOptions) => {
//     try {
//         const transporter = nodemailer.createTransport({
//             host: process.env.SMTP_HOST,
//             port: Number(process.env.SMTP_PORT),
//             secure: false,
//             auth: {
//                 user: process.env.EMAIL_USERNAME,
//                 pass: process.env.EMAIL_PASS,
//             },
//             connectionTimeout: 10000,
//         });

//         const info = await transporter.sendMail(mailOptions);

//         console.log("Email sent:", info.response);

//     } catch (error) {
//         console.error("MAIL ERROR:", error);
//         throw error;
//     }
// };

// module.exports = sendEmail;


const nodemailer = require("nodemailer");

const sendEmail = async (mailOptions) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASS,
            },
        });

        const info = await transporter.sendMail(mailOptions);

        console.log("Email sent:", info.response);

    } catch (error) {
        console.error("MAIL ERROR:", error);
        throw error;
    }
};

module.exports = sendEmail;