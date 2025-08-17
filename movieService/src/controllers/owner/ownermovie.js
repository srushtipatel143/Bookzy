const errorHandler = require("../../helpers/errors/errorHandler");
const Movie = require("../../models/movieInfoModel");

const getmovieaddoption = async (req, res, next) => {
    try {
        const getAllMovie = await Movie.find();
        return res.status(200).json({
            success: true,
            message: "Movie get successfully",
            data: getAllMovie
        });

    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
}

module.exports={getmovieaddoption}