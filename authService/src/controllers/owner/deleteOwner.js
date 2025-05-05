const errorHandler = require("../../helpers/errors/errorHandler");
const Owner = require("../../models/ownerModel");
const deleteOwner = async (req, res, next) => {
    try {
        const id = req.params.id;
        const owner = await Owner.findOne({ _id: id, isDelete: true });
        if (owner) {
            return next(new errorHandler("This owner is already deleted", 400));
        }

        const ownerupdate = await Owner.updateOne(
            { _id: id },
            { $set: { isDelete: true, password: null } }
        );

        if (ownerupdate.modifiedCount === 0) {
            return res.status(404).json({ success: false, message: "Owner not found" });
        }
        return res.status(200).json({ success: true, message: "Owner deleted successfully" });
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
};

module.exports={deleteOwner};