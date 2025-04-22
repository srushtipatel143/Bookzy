const mongoose = require("mongoose");

const movieInfoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref:"AdminCollection"
    },
    title: {
        type: String,
        required: true,
        trim: true,
        unique:true
    },
    releaseDate: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    imageURl: {
        type: String,
        trim: true
    },
    movieLanguage: [{
        language: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: Boolean,
            required: true,
            default: true
        }
    }],
    movieType: [{
        type: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: Boolean,
            required: true,
            default: true
        }
    }],
    about: {
        type: String,
        required: true,
        trim: true
    },
    cast: [{
        actor: {
            type: String,
            required: true,
            trim: true
        },
        role: {
            type: String,
            required: true,
            trim: true
        },
        imageUrl: {
            type: String
        }
    }]

}, { timestamps: true });

module.exports = mongoose.model("movieInfoCollection", movieInfoSchema);
