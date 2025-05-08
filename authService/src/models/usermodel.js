const mongoose = require("mongoose");
const emailValidator = require("email-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const OtpCollection = require("./otpModel");
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        min: [2, "firstName must have atleat 2 characters"],
        trim: true
    },
    lastName: {
        type: String,
        min: [2, "lastName must have atleat 2 characters"],
        trim: true
    },
    email: {
        type: String,
        unique: true,
        require: true,
        validate: {
            validator: (value) => emailValidator.validate(value),
            message: (props) => `${props.value} is not valid email`
        }
    },
    countryCode: {
        type: Number,
        require: true,
        cast: "Country Code is required",
    },
    mobile: {
        type: Number,
        require: true,
        trim: true,
        match: [/^\d{10}$/, "Mobile number must be a 10-digit number"],
    },
    role: {
        type: String,
        require: true,
        enum: {
            values: ["masteradmin", "admin", "owner", "user"],
            message: "{VALUE} is not supported role",
        },
        default: "user"
    },
    isOtpVerificationDone: {
        type: Boolean,
        require: true,
        default: false,
    },
    address:{
        country: {
            type: String,
            require: true,
            trim: true,
        },
        state: {
            type: String,
            require: true,
            trim: true,
        },
        city: {
            type: String,
            require: true,
            trim: true,
        },
        street: {
            type: String,
            require: true,
            trim: true,
        },
        pincode: {
            type: Number,
            require: true,
            trim: true,
            match: [/^\d{6}$/, "Pincode must be a 6-digit number"],
        },
    },
    imageURL: {
        type: String,
        default: "https://www.transparentpng.com/thumb/user/gray-user-profile-icon-png-fP8Q1P.png"
    },
    isDelete: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true }
);


userSchema.methods.generateJWTFromUser = function(){
    const { JWT_SECRET_KEY,JWT_EXPIRE } = process.env;
    payload={
        id:this._id,
        email:this.email,
        role:this.role
    }
    const token=jwt.sign(payload,JWT_SECRET_KEY,{
        expiresIn:JWT_EXPIRE
    })
    return token;
}

userSchema.methods.generateAndSendOtp = async function () {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(12);
    const hashedOtp = await bcrypt.hash(otp, salt);
    const expiresAt = Date.now() + 5 * 60 * 1000;

    await OtpCollection.create({
        userId: this._id,
        otp: hashedOtp,
        expiresAt
    });
    return otp;
}

module.exports = mongoose.model("UserCollection", userSchema);
