const errorHandler = require("../../helpers/errors/errorHandler");
const Admin = require("../../models/adminModel");

const editAdmin = async (req, res, next) => {
    try {
        const id = req.body._id;
        const data = req.body;
        if (data.email) {
            return next(new errorHandler("Email can not be changed", 400));
        }
        const admin = await Admin.findOne({ _id: id });
        if (!!admin.isDelete) {
            return next(new errorHandler("This admin is deleted", 400));
        }
        const adminID = data._id;
        const adminupdate = await Admin.updateOne(
            { _id: adminID },
            { $set: data }
        );
        if (adminupdate.modifiedCount === 0) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }
        return res.status(200).json({ success: true, message: "Admin updated successfully", data: data });

    } catch (error) {
        return next(new errorHandler("Database error", 500, error));
    }
}

module.exports={editAdmin};