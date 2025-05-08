const bcrypt = require("bcrypt");
const errorHandler = require("../../helpers/errors/errorHandler");
const Admin = require("../../models/adminModel");
const { sendToken } = require("../../helpers/jwtToken/tokenHelper");
const sendEmail = require("../../helpers/libraries/sendEmail");
const forgetPasswordAdminLinkCollection = require("../../models/forgetPasswordLinkAdminModal");


const adminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const isAvailableMasterAdminOrAdmin = await Admin.findOne({ email: email });
        if (!isAvailableMasterAdminOrAdmin) {
            return next(new errorHandler("This Admin is not Exist", 404))
        }
        const dbPassword = isAvailableMasterAdminOrAdmin.password;
        const isPasswordMatch = await bcrypt.compare(password, dbPassword);
        if (isPasswordMatch) {
            sendToken(isAvailableMasterAdminOrAdmin, 200, res);
        }
        else {
            return next(new errorHandler("Invalid Password", 409));
        }
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
};

const resetPassword = async (req, res, next) => {
    const { URL, EMAIL_USERNAME } = process.env;
    const resetEmail = req.body.email;
    const admin = await Admin.findOne({ email: resetEmail });

    if (!admin) {
        return next(new errorHandler("There is no admin with this email", 400));
    }
    const resetPasswordToken = await  admin.getResetPasswordTokenFromAdmin();
    const resetPasswordUrl = `${URL}/resetpassword?resetPasswordToken=${resetPasswordToken}`
    const emailTemplate = `
        <h3 style="color : red "> Reset Your Password </h3>
        <p> This <a href=${resetPasswordUrl}   
        target='_blank'  >Link </a> will expire in 10 minutes </p> `;
    try {
        sendEmail({
            from: EMAIL_USERNAME,
            to: resetEmail,
            subject: "Reset Password",
            html: emailTemplate
        });
        return res.status(200).json({ success: true, message: "Mail send successfully" });
    } catch (error) {
        return next(new errorHandler("Email could not be send", 500, error));
    }
}

const setForgotPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;
        const checkLink = await forgetPasswordAdminLinkCollection.findOne({
            token: token
        })
        if(!token) {
            return next(new errorHandler("Please provide a valid token",400))
        }
        if (!checkLink) {
            return next(new errorHandler("Your link is expire", 400));
        }
        const admin=await Admin.findOne({_id:checkLink.userId})
        admin.set({ 
            password: password
        });
        const changeFgtPwd = await admin.save();
        return res.status(200).json({ success: true, message: "Password Reset Successfully", data: changeFgtPwd })
    } catch (error) {
        return next(new errorHandler("Error during passsword reset", 500, error));
    }
}

module.exports = {adminLogin,resetPassword, setForgotPassword };