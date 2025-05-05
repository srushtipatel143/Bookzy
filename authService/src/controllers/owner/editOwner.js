const errorHandler = require("../../helpers/errors/errorHandler");
const Owner = require("../../models/ownerModel");
const editOwner = async (req, res, next) => {
    try {
        const id = req.body._id;
        const data = req.body;

        if (data.email) {
            return next(new errorHandler("Email can not be changed", 400));
        }
        const owner = await Owner.findOne({ _id: id});
        if (!!owner.isDelete) {
            return next(new errorHandler("This owner is deleted", 400));
        }
        const ownerID = data._id;
        const ownerupdate = await Owner.updateOne(
            { _id: ownerID },
            { $set: data }
        );
        if (ownerupdate.modifiedCount === 0) {
            return res.status(404).json({ success: false, message: "Owner not found" });
        }
        return res.status(200).json({ success: true, message: "Owner updated successfully", data: data });

    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
};

module.exports={editOwner};