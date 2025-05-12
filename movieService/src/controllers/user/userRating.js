const Rating = require("../../models/userMovieRatingModel");
const errorHandler = require("../../helpers/errors/errorHandler");

const addRating = async (req, res, next) => {
    try {
        const { movieId, ratings } = req.body;
        const { id } = req.user;
        let movieRating = await Rating.findOne({ movieId });
        if (!movieRating) {
            movieRating = new Rating({
                movieId,
                totalRating: ratings,
                userRatings: [{ userId: id, ratings: ratings }]
            });
        }
        else {
            const existingUserRatingIndex = movieRating.userRatings.findIndex(r => r.userId.toString() === id);
            if (existingUserRatingIndex !== -1) {
                movieRating.userRatings[existingUserRatingIndex].ratings = ratings;
            } else {
                movieRating.userRatings.push({ userId: id, ratings });
            }
            const totalSum = movieRating.userRatings.reduce((sum, r) => sum + r.ratings, 0);
            movieRating.totalRating = totalSum / movieRating.userRatings.length;
        }
        await movieRating.save();
        return res.status(200).json({
            success: true,
            message: "Rating added successfully"
        });
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
};

const getSingleMovieRatings = async (req, res, next) => {
    try {
        const { id } = req.params;
        const ratings = await Rating.findOne({ movieId: id });
        return res.status(200).json({
            success: true,
            message: "rating get successfully",
            data: ratings
        });
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
}

module.exports = { addRating, getSingleMovieRatings };