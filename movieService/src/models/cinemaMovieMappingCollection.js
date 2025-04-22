const mongoose = require("mongoose");

const cinemaMovieMappingSchema = new mongoose.Schema({
    cinemaId: {
        type: Number,
        required: true
    },
    movieId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "movieInfoCollection"
    },
    movieReleaseDate: {
        type: Date,
        required: true
    },
    showTime: {
        type: Date,
        required: true,
    },
    showDate: {
        type: Date,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("cinemaMovieMappingCollection", cinemaMovieMappingSchema)