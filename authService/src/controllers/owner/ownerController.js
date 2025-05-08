const bcrypt = require("bcrypt");
const errorHandler = require("../../helpers/errors/errorHandler");
const Owner = require("../../models/ownerModel");
const { sendToken } = require("../../helpers/jwtToken/tokenHelper");
const sendEmail = require("../../helpers/libraries/sendEmail");
const forgetPasswordLinkOwnerCollection = require("../../models/forgetPasswordLinkOwnerModal")

const ownerLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const IsAvailableOwner = await Owner.findOne({ email: email });
        if (!IsAvailableOwner) {
            return next(new errorHandler("This Owner is not Exist", 404))
        }
        const dbPassword = IsAvailableOwner.password;
        const isPasswordMatch = await bcrypt.compare(password, dbPassword);
        if (isPasswordMatch) {
            sendToken(IsAvailableOwner, 200, res);
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
    const owner = await Owner.findOne({ email: resetEmail });

    if (!owner) {
        return next(new errorHandler("There is no owner with this email", 400, error));
    }
    const resetPasswordToken = await owner.getResetPasswordTokenFromOwner();
    
    const resetPasswordUrl = `${URL}/resetpassword?resetPasswordToken=${resetPasswordToken}`
    const emailTemplate = `
        <h3 style="color : red "> Reset Your Password </h3>
        <p> This <a href=${resetPasswordUrl}   
        target='_blank'  >Link </a> will expire in 1 hours </p> `;
    try {
        sendEmail({
            from: EMAIL_USERNAME,
            to: resetEmail,
            subject: "Reset Password",
            html: emailTemplate
        });
        return res.status(200).json({ success: true, message: "Mail send successfully" });
    } catch (error) {
        owner.resetPasswordToken = undefined;
        owner.resetPasswordExpire = undefined;
        await owner.save();
        return next(new errorHandler("Email could not be send", 500, error));
    }
}

const setForgotPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;
        const checkLink = await forgetPasswordLinkOwnerCollection.findOne({
            token: token
        })
        if(!token) {
            return next(new errorHandler("Please provide a valid token ",400))
        }
        if (!checkLink) {
            return next(new errorHandler("Your link is expire", 400));
        }
        const owner=await Owner.findOne({_id:checkLink.userId})
        owner.set({ 
            password: password,
        });
        const changeFgtPwd = await owner.save();
        return res.status(200).json({ success: true, message: "Password Reset Successfully", data: changeFgtPwd })
    } catch (error) {
        return next(new errorHandler("Error during passsword reset", 500, error));
    }
}

module.exports = {ownerLogin,resetPassword, setForgotPassword };