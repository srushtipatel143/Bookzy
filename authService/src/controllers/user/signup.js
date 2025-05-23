const errorHandler = require("../../helpers/errors/errorHandler");
const User = require("../../models/usermodel");
const OTP = require("../../models/otpModel");
const sendMail = require("../../helpers/libraries/sendEmail");
const bcrypt = require("bcrypt");
const { sendToken } = require("../../helpers/jwtToken/tokenHelper");
const { produceMessage } = require("../../kafka/kafka");
const numberOfPartion = 1;


const signIn = async (req, res, next) => {
    try {
        const data = req.body;
        const user = await User.findOne({ email: data.email });
        let otp, savedUser;
        if (!user) {
            const newUser = new User({ email: data.email });
            savedUser = await newUser.save();
            otp = await savedUser.generateAndSendOtp();
        }
        else {
            if (user && user.isDelete) {
                data.isDelete = false;
                const userToUpdate = user;
                userToUpdate.set(data);
                savedUser = await userToUpdate.save();
            }
            otp = await user.generateAndSendOtp();
        }

        console.log(otp)
        const { EMAIL_USERNAME } = process.env;
        const emailPayload = {
            from: EMAIL_USERNAME,
            to: data.email,
            subject: "Your Otp is here",
            html: `Your OTP code is <h3>${otp}</h3>It is valid for 5 minutes.`,
        };

        const key = "1";
        const topic = "otp";
        //produceMessage(topic, numberOfPartion, key, emailPayload)
        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "OTP has been sent to the email.",
            data: !user ? savedUser : user,
        });
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
};

const validateOtp = async (req, res, next) => {
    try {
        const { userId, otp } = req.body;
        const getOtpForVerification = await OTP.findOne({ userId: userId }).sort({ createdAt: -1 });
        console.log(getOtpForVerification)

        if (!getOtpForVerification) {
            return res.status(404).json({ message: "OTP record not found" });
        }
        const isOtpValid = await bcrypt.compare(otp, getOtpForVerification.otp);
        if (isOtpValid) {
            const user = await User.findById({ _id: userId })
            sendToken(user, 200, res);
        } else {
            return res.status(400).json({ message: "Invalid OTP" });
        }
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
}

const resendOtp = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById({ _id: id });
        const otp = await user.generateAndSendOtp();
        console.log(otp)
        const { EMAIL_USERNAME } = process.env;

        const emailPayload = {
            from: EMAIL_USERNAME,
            to: user.email,
            subject: "Your Otp is here",
            html: `Your OTP code is <h3>${otp}</h3>It is valid for 5 minutes.`,
        };

        const key = "1";
        const topic = "otp";
        //produceMessage(topic, numberOfPartion, key, emailPayload)

        return res.status(200).json({
            success: true,
            message: "OTP has been sent to the email."
        });

    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
}

const editProfile = async (req, res, next) => {
    try {
        const data = req.body;
        const { id } = req.user;
        await User.updateOne({ _id: id }, { $set: data });
        return res.status(200).json({
            success: true,
            message: "Profile Update Successfully"
        });
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
}

const getUserDetail = async (req, res, next) => {
    try {
        const { id } = req.user;
        const user = await User.findById({ _id: id });
        return res.status(200).json({
            success: true,
            data: user,
            message: "User get Successfully"
        });
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        });
        return res.status(200).json({ success: true, message: "User logout successfully" });
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
}

module.exports = { resendOtp, validateOtp, signIn, editProfile, getUserDetail, logout };