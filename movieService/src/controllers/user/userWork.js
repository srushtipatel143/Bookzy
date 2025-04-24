const errorHandler = require("../../helpers/errors/errorHandler");
const { pool } = require("../../config/dbConn");
const Movie = require("../../models/movieInfoModel");
const Show = require("../../models/showInformationModel");
const cityMovieMapping = require("../../models/cityMovieMappingCollection");
const cinemaMovieMapping = require("../../models/cinemaMovieMappingCollection");

const getAllCity = async (req, res, next) => {
    try {
        const query = `SELECT id,city,state,country FROM city`;
        const [cityResponse] = await pool.execute(query);
        return res.status(200).json({ message: "get city successfully", data: cityResponse })
    } catch (error) {
        return next(new errorHandler("Something went wrong",500, error));
    }
}

const getAllCinemaByCity = async (req, res, next) => {
    try {
        const { id } = req.params;
        const query = `SELECT id,cinemaName,cinemaLandmark FROM cinema where cityId=? and status=?`;
        const param = [id, 1];
        const [CinemaResponse] = await pool.execute(query, param);
        return res.status(200).json({ message: "get Cinema successfully", data: CinemaResponse })
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
};

const getSingleMovie = async (req, res, next) => {
    try {
        const id = req.params.id;
        const movieData = await Movie.findById({ _id: id });
        if (!movieData) return next(new errorHandler("Movie not found", 401));
        return res.status(200).json({
            success: true,
            message: "Movie get successfully",
            data: movieData
        });
    } catch (error) {
        return next(new errorHandler("Database error", 500, error));
    }
}

const getShow = async (req, res, next) => {
    try {
        const showId = req.params.id;

        const showData = await Show.findOne({ _id: showId });

        const query = `SELECT seatinfo.screenId as screenId,screenName,screen.noOfRows as screenRow,screen.noOfSeats as screenSeat,seatinfo.RowId as rowId,
        rowName,rowType,rowsinfo.noOfRowSeat as rowSeat,seatinfo.id as seatId,seatName FROM booking.seatinfo
        join rowsinfo on rowsinfo.id=seatinfo.RowId
        join screen on seatinfo.screenId=screen.id where screen.id=?`;
        const [response] = await pool.execute(query, [showData.screenId]);
        const screenMap = new Map();
        const screenData = [];

        for (const item of response) {
            if (!screenMap.has(item.screenId)) {
                const newData = {
                    cinemaId: showData.cinemaId,
                    cinemaName: showData.cinemaName,
                    movieId: showData.movieId,
                    movieName: showData.movieName,
                    screenId: item.screenId,
                    screenName: item.screenName,
                    screenRow: item.screenRow,
                    screenSeat: item.screenSeat,
                    language: showData.movieLanguage,
                    showTime: showData.showStartTime,
                    rows: []
                };
                screenMap.set(item.screenId, newData);
                screenData.push(newData);
            }
            const existingScreen = screenMap.get(item.screenId);
            let existingRow = existingScreen.rows.find(r => r.rowId === item.rowId);
            if (!existingRow) {
                existingRow = {
                    rowId: item.rowId,
                    rowName: item.rowName,
                    rowType: item.rowType,
                    rowSeat: item.rowSeat,
                    price: showData.priceInfoForShow.find((val) => val.rowType === item.rowType)?.price || 0,
                    seats: []
                };
                existingScreen.rows.push(existingRow);
            }
            if (!existingRow.seats.some(s => s.seatId === item.seatId)) {
                existingRow.seats.push({
                    seatId: item.seatId,
                    seatName: item.seatName
                });
            }
        }
        return res.status(200).json({ message: "get screen successfully", data: screenData })

    } catch (error) {
        console.log(error)
        return next(new errorHandler("Database error", 500, error));
    }
}

const getMovieforcinema = async (req, res, next) => {
    try {
        const { screenType, cinemaId, movieLanguage } = req.body;
        const getShowData = await Show.find({ cinemaId, screenType, movieLanguage });
        const responseMap = new Map;
        const responseData = [];
        for (const item of getShowData) {
            if (!responseMap.has(item.movieId.toString())) {
                const newData = {
                    cinemaId: item.cinemaId,
                    cinemaName: item.cinemaName,
                    screenId: item.screenId,
                    screenName: item.screenName,
                    movieId: item.movieId,
                    movieName: item.movieName,
                    movieLanguage: item.movieLanguage,
                    showDetails: [{
                        _id: item._id,
                        showDate: item.showDate,
                        showStartTime: item.showStartTime,
                        priceInfoForShow: item.priceInfoForShow
                    }]
                };
                responseMap.set(item.movieId.toString(), newData);
                responseData.push(newData);
            } else {
                const existingMovie = responseMap.get(item.movieId.toString());
                existingMovie.showDetails.push({
                    _id: item._id,
                    showDate: item.showDate,
                    showStartTime: item.showStartTime,
                    priceInfoForShow: item.priceInfoForShow
                });
            }
        }
        return res.status(200).json({
            success: true,
            message: "Show for cinema get successfully",
            data: responseData
        });
    } catch (error) {
        return next(new errorHandler("Database error", 500, error));
    }
}

const getMoviesInCity = async (req, res, next) => {
    try {
        const { id } = req.params;
        const getMovie = await cityMovieMapping.find({
            cityId: id,
            // showTime: { $exists: true, $not: { $size: 0 } }
        }).populate("movieId");

        res.status(200).json({
            success: true,
            data: getMovie
        });
    } catch (error) {
        return next(new errorHandler("Database error", 500, error));
    }
}

const getMoviesInCinema = async (req, res, next) => {
    try {
        const { id } = req.params;
        const getMovie = await cinemaMovieMapping.find({
            cinemaId: id,
            // showTime: { $exists: true, $not: { $size: 0 } }
        }).populate("movieId");

        res.status(200).json({
            success: true,
            data: getMovie
        });
    } catch (error) {
        return next(new errorHandler("Database error", 500, error));
    }
}

const getLatestMovie = async (req, res, next) => {
    try {
        const { id } = req.params;
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istToday = new Date(now.getTime() + istOffset);
        istToday.setHours(0, 0, 0, 0);
        const today = new Date(istToday.getTime() - istOffset);

        const getMovie = await cityMovieMapping.find({
            cityId: id,
            showTime: { $gte: today }
        }).populate("movieId");

        res.status(200).json({
            success: true,
            data: getMovie
        });

    } catch (error) {
        return next(new errorHandler("Database error", 500, error));
    }
}

const getUpCommingMovie=async(req,res,next)=>{
    try {
        const { id } = req.params;
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istToday = new Date(now.getTime() + istOffset);
        istToday.setHours(0, 0, 0, 0);
        const today = new Date(istToday.getTime() - istOffset);

        const getMovie = await cityMovieMapping.find({
            cityId: id,
            movieReleaseDate: { $gt: today }
        }).populate("movieId");

        res.status(200).json({
            success: true,
            data: getMovie
        });

    } catch (error) {
        return next(new errorHandler("Database error", 500, error));
    }
}

module.exports = { getAllCity, getAllCinemaByCity, getSingleMovie, getShow, getMovieforcinema, getMoviesInCity, getMoviesInCinema, getLatestMovie,getUpCommingMovie };