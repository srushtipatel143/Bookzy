const errorHandler = require("../../helpers/errors/errorHandler");
const Movie = require("../../models/movieInfoModel");
const Show = require("../../models/showInformationModel");

const formatDate = (input) => {
    const date = new Date(input);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const addMovie = async (req, res, next) => {
    try {
        const data = req.body;
        const { id } = req.admin;
        const movieType = JSON.parse(data.movieType);
        const movieLanguage = JSON.parse(data.movieLanguage);
        const cast = JSON.parse(data.cast);
        const formatted = formatDate(data.releaseDate)

        cast.forEach(actor => {
            if (actor.imageUrl?.trim() === '') {
                delete actor.imageUrl;
            }
        });

        const movieDataVal = {
            ...data,
            releaseDate: formatted,
            movieType,
            movieLanguage,
            cast,
            userId: id
        };

        const movie = new Movie(movieDataVal);
        const movieData = await movie.save();
        const formattedResponse = {
            ...movieData.toObject(),
            releaseDate: formatDate(movieData.releaseDate)
        };

        return res.status(200).json({
            success: true,
            message: "Movie added successfully",
            data: formattedResponse
        });
    } catch (error) {
        console.log(error)
        return next(new errorHandler("Something went wrong", 500, error));
    }
}

const updateMovie = async (req, res, next) => {
    try {
        const data = req.body;
        const { id } = req.admin;
        const movieType = JSON.parse(data.movieType);
        const movieLanguage = JSON.parse(data.movieLanguage);
        const cast = JSON.parse(data.cast);
        const formatted = formatDate(data.releaseDate)
        const movie = await Movie.findById({ _id: data._id })
        if (!movie) return next(new errorHandler("Movie not found", 401));
        if (movie.userId.toString() !== id) return next(new errorHandler("User is not authorized", 403));
        const movieDataVal = {
            ...data,
            releaseDate: formatted,
            movieType,
            movieLanguage,
            cast,
            userId: id
        };
        await Movie.updateOne({ _id: data._id }, { $set: movieDataVal });
        if (movie.title !== data.title) {
            await Show.updateMany({ movieId: data._id }, { $set: { movieName: data.title } })
        }
        movieDataVal._id = data._id;
        return res.status(200).json({
            success: true,
            message: "Movie updated successfully",
            data: movieDataVal
        });
    } catch (error) {
        console.log(error)
        return next(new errorHandler("Something went wrong", 500, error));
    }
}

const getAllMovie = async (req, res, next) => {
    try {
        const userId = req.admin.id;
        const getAllMovie = await Movie.find({ userId: userId });
        const formattedMovies = getAllMovie.map((item) => {
            const movie = item.toObject();
            movie.releaseDate = formatDate(item.releaseDate);
            return movie;
        });
        return res.status(200).json({
            success: true,
            message: "Movie get successfully",
            data: formattedMovies
        });

    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
}

const getSingleMovie = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.admin.id;
        const getMovie = await Movie.findOne({ _id: id, userId: userId });
        if (!getMovie) {
            return next(new errorHandler("Movie not found", 401));
        }
        return res.status(200).json({
            success: true,
            message: "Movie get successfully",
            data: getMovie
        });
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
}

module.exports = { addMovie, updateMovie, getAllMovie, getSingleMovie }