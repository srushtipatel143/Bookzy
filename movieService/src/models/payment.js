const mongoose = require("mongoose");

const payementSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "bookingCollection"
    },
    orderId:{
        type:String,
        required:true,
        trim:true
    },
    paymentId:{
        type:String,
        required:true,
        trim:true
    },
    currency:{
        type:String,
        required:true,
        trim:true
    },
    paymentMethod:{
        type:String,
        required:true,
        trim:true
    }
}, { timestamps: true });

module.exports = mongoose.model("paymentCollection", payementSchema);
