const mongoose = require("mongoose");

const payementSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "bookingCollection"
    },
    paymentMethod:{
        type:String,
        required:true,
        trim:true
    }
}, { timestamps: true });

module.exports = mongoose.model("paymentCollection", payementSchema);
