const errorHandler = require("../../helpers/errors/errorHandler");
const Admin = require("../../models/adminModel");
const deleteAdmin = async (req, res, next) => {
    try {
        const id = req.params.id;
        const admin = await Admin.findOne({ _id: id, isDelete: true });
        if (admin) {
            return next(new errorHandler("This admin is already deleted", 400));
        }

        const adminupdate = await Admin.updateOne(
            { _id: id },
            { $set: { isDelete: true, password: null } }
        );

        if (adminupdate.modifiedCount === 0) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }
        return res.status(200).json({ success: true, message: "Admin deleted successfully" });
    } catch (error) {
        return next(new errorHandler("Database error", 500, error));
    }
};

module.exports={deleteAdmin};