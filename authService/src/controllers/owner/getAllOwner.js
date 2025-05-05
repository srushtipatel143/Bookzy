const errorHandler = require("../../helpers/errors/errorHandler");
const Owner = require("../../models/ownerModel");

const getAllOwner = async (req, res, next) => {
    const id=req.admin._id;

    try {
        const owner = await Owner.find({createdBy:id,isDelete: false});
        if(owner.length===0){
            return res.status(200).json({ success: true, message: "No Records Found"})
        }
        return res.status(200).json({ success: true, message: "All Owner get successfully", data: owner })
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
};

module.exports={getAllOwner};