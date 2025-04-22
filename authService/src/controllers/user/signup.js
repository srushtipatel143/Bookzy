const errorHandler = require("../../helpers/errors/errorHandler");
const User = require("../../models/usermodel");
const OTP = require("../../models/otpModel");
const sendMail = require("../../helpers/libraries/sendEmail");
const bcrypt = require("bcrypt");
const { sendToken } = require("../../helpers/jwtToken/tokenHelper");
const { produceMessage } = require("../../kafka/kafka");
const numberOfPartion = 1;

const signup = async (req, res, next) => {
    try {
        const data = req.body;
        let savedUser;

        const IsAvailableUser = await User.findOne({ email: data.email });
        if (IsAvailableUser && IsAvailableUser.isDelete) {
            data.isDelete = false;
            const userToUpdate = IsAvailableUser;
            userToUpdate.set(data);
            savedUser = await userToUpdate.save();
        }
        else {
            const newUser = new User(data);
            savedUser = await newUser.save();
        }
        const otp = await savedUser.generateAndSendOtp();
        const { EMAIL_USERNAME } = process.env;

        const emailPayload = {
            from: EMAIL_USERNAME,
            to: data.email,
            subject: "Your Otp is here",
            html: `Your OTP code is <h3>${otp}</h3>It is valid for 5 minutes.`,
        };

        const key = "1";
        const topic = "otp";

        produceMessage(topic, numberOfPartion, key, emailPayload)

        return res.status(200).json({
            success: true,
            message: "User registered successfully. OTP has been sent to the email.",
            data: savedUser,
        });
    } catch (error) {
        return next(new errorHandler("Database error", 500, error));
    }
};


const signIn = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                message: "User is not registered",
            });
        }
        const otp = await user.generateAndSendOtp();
        console.log(otp)
        const { EMAIL_USERNAME } = process.env;
        const emailPayload = {
            from: EMAIL_USERNAME,
            to: email,
            subject: "Your Otp is here",
            html: `Your OTP code is <h3>${otp}</h3>It is valid for 5 minutes.`,
        };

        const key = "1";
        const topic = "otp";
        produceMessage(topic, numberOfPartion, key, emailPayload)
        return res.status(200).json({
            success: true,
            message: "OTP has been sent to the email.",
            data: user,
        });
    } catch (error) {
        return next(new errorHandler("Database error", 500, error));
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
            //return res.status(200).json({ message: "OTP verified successfully",data:user });
        } else {
            return res.status(400).json({ message: "Invalid OTP" });
        }
    } catch (error) {
        return next(new errorHandler("Database error", 500, error));
    }
}

const resendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email });
        const otp = await user.generateAndSendOtp();
        console.log(otp)
        const { EMAIL_USERNAME } = process.env;
        // sendMail({
        //     from: EMAIL_USERNAME,
        //     to: email,
        //     subject: "Your Otp is here",
        //     html: `Your OTP code is <h3>${otp}</h3>It is valid for 5 minutes.`
        // });

        const emailPayload = {
            from: EMAIL_USERNAME,
            to: email,
            subject: "Your Otp is here",
            html: `Your OTP code is <h3>${otp}</h3>It is valid for 5 minutes.`,
        };

        const key = "1";
        const topic = "otp";
        produceMessage(topic, numberOfPartion, key, emailPayload)

        return res.status(200).json({
            success: true,
            message: "OTP has been sent to the email."
        });

    } catch (error) {
        return next(new errorHandler("Database error", 500, error));
    }
}

const editProfile = async (req, res, next) => {
    try {
        const data = req.body;
        const { id } = req.user;
        await User.updateOne({ _id: id },{ $set: data });
        return res.status(200).json({
            success: true,
            message: "Profile Update Successfully"
        });
    } catch (error) {
        return next(new errorHandler("Database error", 500, error));
    }
}


module.exports = { signup, resendOtp, validateOtp, signIn, editProfile };