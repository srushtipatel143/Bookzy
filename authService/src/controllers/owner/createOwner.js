const errorHandler = require("../../helpers/errors/errorHandler");
const Owner = require("../../models/ownerModel");
const sendEmail = require("../../helpers/libraries/sendEmail");

const createOwner = async (req, res, next) => {
    try {
        const data = req.body;
        const admin = req.admin;
        data.createdBy = admin._id;
        let savedOwner;

        if (data.password) {
            return next(new errorHandler("Password should not allow during owner creation", 400));
        }
        const IsAvailableOwner = await Owner.findOne({ email: data.email });
        if (IsAvailableOwner && IsAvailableOwner.isDelete) {
            data.isDelete = false;
            data.isFirstTimeLoggedIn = true;
            const ownerToUpdate = IsAvailableOwner;
            ownerToUpdate.set(data);
            savedOwner = await ownerToUpdate.save();
        }
        else {
            const newOwner = new Owner(data);
            savedOwner = await newOwner.save();
        }
        const randomPassWord = savedOwner.randomPassWord;
        delete savedOwner.randomPassWord;

        const { EMAIL_USERNAME } = process.env;
        sendEmail({
            from: EMAIL_USERNAME,
            to: data.email,
            subject: "Your credentials",
            html: `<p>Password : ${randomPassWord} </p>`
        });
        return res.status(200).json({ success: true, message: "Owner registered successfully", data: savedOwner})
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
}

module.exports={createOwner};