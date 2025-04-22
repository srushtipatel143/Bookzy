const mongoose = require("mongoose");

const userMovieRatingSchema = new mongoose.Schema({
    movieId: {
        type:mongoose.Schema.ObjectId,
        required: true,
    },
    totalRating: {
        type: Number,
        required: true,
    },
    userRatings: [{
        userId: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: "UserCollection",
        },
        ratings: {
            type: Number,
            required: true
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model("userMovieRatingCollection", userMovieRatingSchema);
