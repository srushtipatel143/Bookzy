const mongoose = require("mongoose");

const showInformationSchema = new mongoose.Schema({
    cinemaId: {
        type: Number,
        required: true,
    },
    cinemaName: {
        type: String,
        required: true,
        trim:true
    },
    screenId: {
        type: Number,
        required: true
    },
    screenName: {
        type: String,
        required: true,
        trim:true
    },
    screenType:{
        type: String,
        required: true,
        trim:true
    },
    movieId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref:"movieInfoCollection"
    },
    movieName: {
        type: String,
        required: true,
        trim:true
    },
    movieLanguage: {
        type: String,
        required: true,
        trim:true
    },
    showDate: {
        type: Date,
        required: true,
    },
    showStartTime: {
        type: Date,
        required: true,
    },
    priceInfoForShow: [{
        rowType: {
            type: String,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            required: true
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model("showInformationCollection", showInformationSchema);
