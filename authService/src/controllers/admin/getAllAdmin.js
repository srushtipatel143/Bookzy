const errorHandler = require("../../helpers/errors/errorHandler");
const Admin = require("../../models/adminModel");
const Owner = require("../../models/ownerModel");

const getAllAdmin = async (req, res, next) => {
    try {
        const user = req.admin;
        const admin = await Admin.find({ isDelete: false, role: { $ne: "masteradmin" } });
        const owner = await Owner.find({ createdBy: user._id,isDelete: false });
        const data = [...admin, ...owner];
        return res.status(200).json({ success: true, message: "All Admin get successfully", data: data })
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
}

module.exports = { getAllAdmin };
