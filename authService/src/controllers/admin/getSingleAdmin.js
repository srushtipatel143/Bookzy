const errorHandler = require("../../helpers/errors/errorHandler");
const Admin = require("../../models/adminModel");
const getSingleAdmin = async (req, res, next) => {
    try {
        const id = req.params.id;
        const admin = await Admin.findOne({ _id: id, isDelete: false });
        if (!admin) {
            return next(new errorHandler("This admin is not Exist", 404))
        }
        return res.status(200).json({ success: true, message: "Admin get successfully", data: admin })

    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
}

module.exports={getSingleAdmin}