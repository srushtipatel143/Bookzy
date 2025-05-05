const errorHandler = require("../../helpers/errors/errorHandler");
const Movie = require("../../models/movieInfoModel");
const Show=require("../../models/showInformationModel");

const addMovie = async (req, res, next) => {
    try {
        const data = req.body;
        const { id } = req.admin;

        const movie = new Movie({ ...data, userId: id });
        const movieData = await movie.save();

        return res.status(200).json({
            success: true,
            message: "Movie added successfully",
            data: movieData
        });
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
}

const updateMovie = async (req, res, next) => {
    try {
        const data = req.body; 
        const { id } = req.admin;

        const movie=await Movie.findById({_id:data._id})
        if(!movie) return next(new errorHandler("Movie not found", 401));
        if (movie.userId.toString() !== id)  return next(new errorHandler("User is not authorized", 403));
        await Movie.updateOne({_id:data._id},{$set:data});
        if(movie.title!==data.title){
             await Show.updateMany({movieId:data._id},{$set:{movieName:data.title}})
        }
        return res.status(200).json({
            success: true,
            message: "Movie updated successfully",
            data: data
        });
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
}

const getAllMovie = async (req, res, next) => {
    try {
        const userId = req.admin.id;
        const getAllMovie = await Movie.find({userId:userId});
        return res.status(200).json({
            success: true,
            message: "Movie get successfully",
            data: getAllMovie
        });

    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
}

const getSingleMovie = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.admin.id;
        const getMovie = await Movie.findOne({ _id: id,userId:userId });
        if(!getMovie){
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