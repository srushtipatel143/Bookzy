const mongoose = require("mongoose");
const emailValidator = require("email-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const forgetPasswordLinkCollection = require("./forgetPasswordLinkAdminModal");

const adminSchema = new mongoose.Schema({
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
    userName: {
        type: String,
        unique: true,
        require: true,
        min: [5, "userName must have atleat 2 characters"],
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
    password: {
        type: String,
        require: true,
        min: [6, "Password must have atleat 6 characters"],
        trim: true,
    }, countryCode: {
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
    isFirstTimeLoggedIn: {
        type: Boolean,
        require: true,
        default: true,
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
    address: {
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
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        require: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
},
    { timestamps: true }
);

adminSchema.methods.generateJWTFromUser = function () {
    const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env;
    payload = {
        id: this._id,
        email: this.email,
        role:this.role
    }
    const token = jwt.sign(payload, JWT_SECRET_KEY, {
        expiresIn: JWT_EXPIRE
    })
    return token;
}

adminSchema.methods.getResetPasswordTokenFromAdmin = async function () {
    const { RESET_PASSWORD_EXPIRE } = process.env;
    const randomHexString = crypto.randomBytes(20).toString("hex")
    const resetPasswordToken = crypto.createHash("SHA256").update(randomHexString).digest("hex")
    // this.resetPasswordToken = resetPasswordToken
    // this.resetPasswordExpire =Date.now()+ parseInt(RESET_PASSWORD_EXPIRE)
    const expiresAt = Date.now() + 10 * 60 * 1000;

    await forgetPasswordLinkCollection.create({
        userId: this._id,
        token: resetPasswordToken,
        expiresAt
    });
    return resetPasswordToken
}

adminSchema.pre("save", async function (next) {
    if (!this.password) {
        const randomPassWord = crypto.randomBytes(4).toString("hex");
        this.randomPassWord = randomPassWord;
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(randomPassWord, salt);
    } else {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

module.exports = mongoose.model("AdminCollection", adminSchema);
