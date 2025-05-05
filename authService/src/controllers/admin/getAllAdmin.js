const errorHandler = require("../../helpers/errors/errorHandler");
const Admin = require("../../models/adminModel");

const getAllAdmin = async (req, res, next) => {
    try {
        const admin = await Admin.find({ isDelete: false, role: { $ne: "masteradmin" } });
        return res.status(200).json({ success: true, message: "All Admin get successfully", data: admin })
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
}

module.exports={getAllAdmin};
