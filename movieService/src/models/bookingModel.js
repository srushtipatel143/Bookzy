const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    showId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "showInformationCollection"
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "UserCollection",
    },
    bookingDate: {
        type: Date,
        required: true
    },
    paymentStatus: {
        type: String,
        required: true,
        trim: true
    },
    noOfTickets: {
        type: Number,
        required: true,
    },
    totalGST: {
        type: Number,
        required: true,
    },
    totalTicketPrice: {
        type: Number,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    ticketes: [{
        seatName: {
            type: String,
            required: true,
        },
        rowName: {
            type: String,
            required: true,
        },

        seatType: {
            type: String,
            required: true,
        },
        ticketPrice: {
            type: Number,
            required: true,
        },
        ticketGST: {
            type: Number,
            required: true,
        }
    }]

}, { timestamps: true });

module.exports = mongoose.model("bookingCollection", bookingSchema);
