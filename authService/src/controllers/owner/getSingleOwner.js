const errorHandler = require("../../helpers/errors/errorHandler");
const Owner = require("../../models/ownerModel");

const getSingleOwner = async (req, res, next) => {
    try {
        const id = req.params.id;
        const owner = await Owner.findOne({ _id: id, isDelete: false });
        if (!owner) {
            return next(new errorHandler("This owner is not Exist", 404))
        }
        return res.status(200).json({ success: true, message: "Owner get successfully", data: owner })

    } catch (error) {
        return next(new errorHandler("Databaseb error", 500, error));
    }
}

module.exports={getSingleOwner};