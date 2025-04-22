const errorHandler = require("../../helpers/errors/errorHandler");
const Admin = require("../../models/adminModel");
const sendEmail = require("../../helpers/libraries/sendEmail");

const createAdmin = async (req, res, next) => {
    try {
        const data = req.body;
        const admin = req.admin;
        let savedAdmin;

        if (data.password) {
            return next(new errorHandler("Password should not allow during admin creation", 400));
        }
        const IsAvailableAdmin = await Admin.findOne({ email: data.email });
        if (IsAvailableAdmin && IsAvailableAdmin.isDelete) {
            data.isDelete = false;
            data.isFirstTimeLoggedIn = true;
            const adminToUpdate = IsAvailableAdmin;
            adminToUpdate.set(data);
            savedAdmin = await adminToUpdate.save();
        }
        else {
            const newAdmin = new Admin(data);
            savedAdmin = await newAdmin.save();
        }
        const randomPassWord = savedAdmin.randomPassWord;
        delete savedAdmin.randomPassWord;

        const { EMAIL_USERNAME } = process.env;
        sendEmail({
            from: EMAIL_USERNAME,
            to: data.email,
            subject: "Your credentials",
            html: `<p>Password : ${randomPassWord} </p>`
        });
        return res.status(200).json({ success: true, message: "Admin registered successfully", data: savedAdmin })
    } catch (error) {
        return next(new errorHandler("Databaseb error", 500, error));
    }
}

module.exports={createAdmin};