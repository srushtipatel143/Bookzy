const errorHandler = require("../../helpers/errors/errorHandler");
const { pool } = require("../../config/dbConn");
const Movie = require("../../models/movieInfoModel");
const Show = require("../../models/showInformationModel");
const cityMovieMapping = require("../../models/cityMovieMappingCollection");
const Rating = require("../../models/userMovieRatingModel");
const { isTokenIncluded, getAccessTokenFromHeader } = require("../../helpers/jwtToken/tokenHelper");
const jwt = require("jsonwebtoken");

const getAllCity = async (req, res, next) => {
    try {
        const query = `SELECT id,city,state,country FROM city`;
        const [cityResponse] = await pool.execute(query);
        return res
            .status(200)
            .json({ message: "get city successfully", data: cityResponse });
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
};

const getAllCinemaByCity = async (req, res, next) => {
    try {
        const { id } = req.params;
        const query = `SELECT id,cinemaName,cinemaLandmark FROM cinema where cityId=? and status=?`;
        const param = [id, 1];
        const [CinemaResponse] = await pool.execute(query, param);
        return res
            .status(200)
            .json({ message: "get Cinema successfully", data: CinemaResponse });
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
};

const getISTDateISO = (date) => {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(date);
};

const getISTMidnight = (date) => {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(date);

    const year = parts.find(p => p.type === "year").value;
    const month = parts.find(p => p.type === "month").value;
    const day = parts.find(p => p.type === "day").value;
    return new Date(`${year}-${month}-${day}T00:00:00+05:30`);
};

const getAllCinemaByFilter = async (req, res, next) => {
    try {
        const data = req.query;

        console.log(data)
        const istOffset = 5.5 * 60 * 60 * 1000;
        const inputUTC = new Date(data.todayTime);
        const nowUTC = new Date();

        const nowIST = new Date(nowUTC.getTime() + istOffset);

        const istDayStart = new Date(inputUTC);

        const istDayEnd = new Date(istDayStart);
        istDayEnd.setHours(18, 30, 0, 0);
        const utcDayEnd = new Date(istDayEnd.getTime() + istOffset);
        const isTodayIST = istDayStart.toDateString() === nowIST.toDateString();

        let startUTC, endUTC;

        if (isTodayIST) {
            startUTC = nowUTC;
            endUTC = utcDayEnd;
        } else {
            startUTC = inputUTC;
            endUTC = utcDayEnd;
        }

        const getdata = await Show.find({
            movieId: data.movieId,
            movieLanguage: data.language,
            screenType: data.selectScreen,
            showStartTime: {
                $gte: startUTC,
                $lte: endUTC,
            },
        });

        const currenttime = new Date();

        const shows = await Show.find(
            {
                movieId: data.movieId,
                movieLanguage: data.language,
                screenType: data.selectScreen,
                showStartTime: { $gte: currenttime }
            },
            {
                showDate: 1,
                _id: 0
            }
        );

        const existingDateStrings = shows.map(s => getISTDateISO(s.showDate));
        const sortedDates = [...existingDateStrings].sort();

        const startDate = new Date();
        const endDate = new Date(sortedDates[sortedDates.length - 1]);

        endDate.setUTCDate(endDate.getUTCDate());
        endDate.setUTCHours(18, 30, 0, 0);
        const allDates = [];
        const getCinemaId = getdata.map((item) => item.cinemaId);
        const uniqueCinemaId = [...new Set(getCinemaId)];

        let current = new Date(startDate);

        while (getISTDateISO(current) <= getISTDateISO(endDate)) {

            const istDateStr = getISTDateISO(current);
            const istMidnight = getISTMidnight(current);

            const weekday = istMidnight.toLocaleDateString("en-IN", {
                weekday: "short",
                timeZone: "Asia/Kolkata"
            }).toUpperCase();

            const day = istMidnight.toLocaleDateString("en-IN", {
                day: "2-digit",
                timeZone: "Asia/Kolkata"
            });

            const month = istMidnight.toLocaleDateString("en-IN", {
                month: "short",
                timeZone: "Asia/Kolkata"
            }).toUpperCase();

            const formattedDate = `${weekday} ${day} ${month}`;

            allDates.push({
                formattedDate,
                rawDate: istMidnight,
                weekday,
                day,
                month,
                hasShow: existingDateStrings.includes(istDateStr),
            });
            current.setUTCDate(current.getUTCDate() + 1);
        }

        if (uniqueCinemaId.length === 0) {
            return res.status(200).json({
                message: "No cinemas found", data: {
                    allDates
                }
            });
        }

        const placeholders = uniqueCinemaId.map(() => "?").join(",");
        const query = `SELECT id, cinemaName, cinemaLandmark FROM cinema WHERE cityId = ? AND status = ? AND id IN (${placeholders})`;
        const param = [data.cityId, 1, ...uniqueCinemaId];
        const [CinemaResponse] = await pool.execute(query, param);

        const cinemaShowMap = new Map();
        getdata.forEach((show) => {
            const cinemaId = show.cinemaId.toString();
            if (!cinemaShowMap.has(cinemaId)) {
                cinemaShowMap.set(cinemaId, []);
            }
            const showDate = new Date(show.showStartTime);

            const formattedTime = showDate.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
                timeZone: "Asia/Kolkata",
            });

            const formattedTimeFull = showDate.toLocaleTimeString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
                timeZone: "Asia/Kolkata",
            });

            cinemaShowMap.get(cinemaId).push({
                ...(show.toObject ? show.toObject() : show),
                formattedShowTime: formattedTime,
                formattedTimeFull: formattedTimeFull,
            });
        });

        const finalData = CinemaResponse.map((cinema) => ({
            ...cinema,
            show: cinemaShowMap.get(cinema.id.toString()) || [],
        }));

        return res.status(200).json({
            message: "Get cinema successfully", data: {
                allDates,
                showData: finalData
            }
        });
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
};

const getShow = async (req, res, next) => {
    try {
        const showId = req.params.id;
        const showData = await Show.findOne({ _id: showId });
        const { JWT_SECRET_KEY } = process.env;
        let decoded = null;
        let userId = null;
        if (isTokenIncluded(req)) {
            const accessToken = getAccessTokenFromHeader(req);
            decoded = jwt.verify(accessToken, JWT_SECRET_KEY);
            userId = decoded.id;
        }

        // const query = `SELECT seatinfo.screenId as screenId,screenName,screen.noOfRows as screenRow,screen.noOfSeats as screenSeat,seatinfo.RowId as rowId,
        // rowName,rowType,rowsinfo.noOfRowSeat as rowSeat,seatinfo.id as seatId,seatName FROM seatinfo
        // join rowsinfo on rowsinfo.id=seatinfo.RowId
        // join screen on seatinfo.screenId=screen.id where screen.id=?`;

        let seatStatusCase = `
            WHEN seatbooking.status = 'booked' THEN 'booked'
            ELSE 'available'
        `;

        if (userId) {
            seatStatusCase = `
                WHEN seatbooking.status = 'booked' THEN 'booked'
                WHEN seatbooking.status = 'processing' AND seatbooking.userId != '${userId}' THEN 'processing'
                WHEN seatbooking.status = 'processing' AND seatbooking.userId = '${userId}' THEN 'available'
                ELSE 'available'
            `;
        }

        const query = `
        SELECT 
            seatbooking.id,
            seatbooking.status,
            seatinfo.screenId AS screenId,
            screen.screenName,
            screen.noOfRows AS screenRow,
            screen.noOfSeats AS screenSeat,
            seatinfo.RowId AS rowId,
            rowsinfo.rowName,
            rowsinfo.rowType,
            rowsinfo.noOfRowSeat AS rowSeat,
            seatinfo.id AS seatId,
            seatinfo.seatName,
            CASE 
                ${seatStatusCase}
            END AS seatStatus
        FROM seatinfo
        JOIN rowsinfo ON rowsinfo.id = seatinfo.RowId
        JOIN screen ON screen.id = seatinfo.screenId
        LEFT JOIN seatbooking 
            ON seatbooking.screenId = seatinfo.screenId 
            AND seatbooking.rowName = rowsinfo.rowName 
            AND seatbooking.seatName = seatinfo.seatName 
            AND seatbooking.showId = ?
        WHERE screen.id = ?`;

        const [response] = await pool.execute(query, [showId, showData.screenId]);
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
                    types: [],
                };
                screenMap.set(item.screenId, newData);
                screenData.push(newData);
            }
            const existingScreen = screenMap.get(item.screenId);

            let existingType = existingScreen.types.find(
                (t) => t.rowType === item.rowType
            );
            if (!existingType) {
                existingType = {
                    rowType: item.rowType,
                    price:
                        showData.priceInfoForShow.find(
                            (val) => val.rowType === item.rowType
                        )?.price || 0,
                    rows: [],
                };
                existingScreen.types.push(existingType);
            }

            let existingRow = existingType.rows.find((r) => r.rowId === item.rowId);
            if (!existingRow) {
                existingRow = {
                    rowId: item.rowId,
                    rowName: item.rowName,
                    rowSeat: item.rowSeat,
                    seats: [],
                };
                existingType.rows.push(existingRow);
            }
            if (!existingRow.seats.some((s) => s.seatId === item.seatId)) {
                existingRow.seats.push({
                    id: item.id,
                    status: item.status,
                    seatId: item.seatId,
                    seatName: item.seatName,
                });
            }
        }
        return res.status(200).json({ message: "get screen successfully", data: screenData[0] });
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
};

const getMovieforcinema = async (req, res, next) => {
    try {
        const { screenType, cinemaId, movieLanguage } = req.body;
        const getShowData = await Show.find({
            cinemaId,
            screenType,
            movieLanguage,
        });
        const responseMap = new Map();
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
                    showDetails: [
                        {
                            _id: item._id,
                            showDate: item.showDate,
                            showStartTime: item.showStartTime,
                            priceInfoForShow: item.priceInfoForShow,
                        },
                    ],
                };
                responseMap.set(item.movieId.toString(), newData);
                responseData.push(newData);
            } else {
                const existingMovie = responseMap.get(item.movieId.toString());
                existingMovie.showDetails.push({
                    _id: item._id,
                    showDate: item.showDate,
                    showStartTime: item.showStartTime,
                    priceInfoForShow: item.priceInfoForShow,
                });
            }
        }
        return res.status(200).json({
            success: true,
            message: "Show for cinema get successfully",
            data: responseData,
        });
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
};

const getMoviesInCinema = async (req, res, next) => {
    try {
        const { cinemaId, todayTime } = req.query;

        const query = `SELECT cinema.id,cinemaName,cinemaLandmark,address,facility,cinemainformation.status FROM cinema
        join cinemainformation on cinemainformation.cinemaId=cinema.id
        where cinema.id=? and cinema.status=?`;
        const param = [cinemaId, 1];
        const [CinemaResponse] = await pool.execute(query, param);
        let cinema = null;
        CinemaResponse.forEach((item) => {
            if (!cinema) {
                cinema = {
                    id: item.id,
                    cinemaName: item.cinemaName,
                    cinemaLandmark: item.cinemaLandmark,
                    address: item.address,
                    facility: [],
                };
            }
            if (item.facility) {
                cinema.facility.push({
                    facility: item.facility,
                    status: item.status,
                });
            }
        });
        if (CinemaResponse.length === 0) {
            return res.status(404).json({ success: false, message: "Cinema not found" });
        }

        const istOffset = 5.5 * 60 * 60 * 1000;
        const inputUTC = new Date(todayTime);
        const nowUTC = new Date();
        const nowIST = new Date(nowUTC.getTime() + istOffset);
        const istDayStart = new Date(inputUTC);
        const istDayEnd = new Date(istDayStart);
        istDayEnd.setHours(18, 30, 0, 0);
        const utcDayEnd = new Date(istDayEnd.getTime() + istOffset);
        const isTodayIST = istDayStart.toDateString() === nowIST.toDateString();

        let startUTC, endUTC;

        if (isTodayIST) {
            startUTC = nowUTC;
            endUTC = utcDayEnd;
        } else {
            startUTC = inputUTC;
            endUTC = utcDayEnd;
        }
        const getdata = await Show.find({
            cinemaId: cinemaId,
            showStartTime: {
                $gte: startUTC,
                $lte: endUTC,
            },
        });

        const currenttime = new Date();

        const shows = await Show.find(
            {
                cinemaId: cinemaId,
                showStartTime: { $gte: currenttime }
            },
            {
                showDate: 1,
                _id: 0
            }
        );

        const existingDateStrings = shows.map(s => getISTDateISO(s.showDate));
        const sortedDates = [...existingDateStrings].sort();
        const startDate = new Date();
        const endDate = new Date(sortedDates[sortedDates.length - 1]);
        endDate.setUTCDate(endDate.getUTCDate());
        endDate.setUTCHours(18, 30, 0, 0);
        const allDates = [];
        let current = new Date(startDate);

       while (getISTDateISO(current) <= getISTDateISO(endDate)) {

            const istDateStr = getISTDateISO(current);
            const istMidnight = getISTMidnight(current);

            const weekday = istMidnight.toLocaleDateString("en-IN", {
                weekday: "short",
                timeZone: "Asia/Kolkata"
            }).toUpperCase();

            const day = istMidnight.toLocaleDateString("en-IN", {
                day: "2-digit",
                timeZone: "Asia/Kolkata"
            });

            const month = istMidnight.toLocaleDateString("en-IN", {
                month: "short",
                timeZone: "Asia/Kolkata"
            }).toUpperCase();

            const formattedDate = `${weekday} ${day} ${month}`;

            allDates.push({
                formattedDate,
                rawDate: istMidnight,
                weekday,
                day,
                month,
                hasShow: existingDateStrings.includes(istDateStr),
            });
            current.setUTCDate(current.getUTCDate() + 1);
        }


        const movieShowMap = new Map();
        getdata.forEach((show) => {
            const movieId = show.movieId.toString();
            if (!movieShowMap.has(movieId)) {
                movieShowMap.set(movieId, {
                    movieId: movieId,
                    movieName: show.movieName,
                    shows: [],
                });
            }
            const showDate = new Date(show.showStartTime);

            const formattedTime = showDate.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
                timeZone: "Asia/Kolkata", // IST
            });

            const formattedTimeFull = showDate.toLocaleTimeString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
                timeZone: "Asia/Kolkata",
            });

            movieShowMap.get(movieId).shows.push({
                ...(show.toObject ? show.toObject() : show),
                formattedShowTime: formattedTime,
                formattedTimeFull: formattedTimeFull,
            });
        });
        const finalData = {
            ...cinema,
            allDates: allDates,
            movieData: Array.from(movieShowMap.values()),
        };
        return res.status(200).json({
            success: true,
            data: finalData,
        });
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
};

const getLatestMovie = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const today = new Date();

        const getdata = await cityMovieMapping.find({
            cityId: id,
            showTime: { $gte: today },
            movieReleaseDate: { $lte: today },
        });

        const getMovie = await Promise.all(
            getdata.map(async (item) => {
                const movieDetail = await Movie.findById({ _id: item.movieId });
                const userRating = await Rating.findOne({ movieId: item.movieId });
                const getMoviescreentype = await Show.find({
                    movieId: item.movieId,
                    showStartTime: { $gte: today },
                });

                let ratingData = [];
                if (userRating && userRating.userRatings.length > 0) {
                    ratingData = {
                        totalRating: userRating.totalRating,
                        votes: userRating.userRatings.length,
                    };
                }

                const screenType = getMoviescreentype.map((item) => {
                    return item.screenType;
                });

                const screenTypes = [...new Set(screenType)];
                const movieData = {
                    ...movieDetail.toObject(),
                    ratingData,
                    screenTypes,
                };
                return movieData;
            })
        );
        return res.status(200).json({
            success: true,
            data: getMovie,
        });
    } catch (error) {
        return next(new errorHandler("Something went wrong ", 500, error));
    }
};

const getUpCommingMovie = async (req, res, next) => {
    try {
        const { id } = req.params;
        const today = new Date();
        const mappings = await cityMovieMapping.find({
            cityId: id,
            movieReleaseDate: { $gt: today },
        });

        const mappedMovieIds = mappings.map(item => item.movieId);
        const mappedMovies = await Promise.all(
            mappedMovieIds.map(async (movieId) => {
                const movieDetail = await Movie.findById(movieId);

                const shows = await Show.find({
                    movieId: movieId,
                    showStartTime: { $gte: today },
                });
                const screenTypes = [
                    ...new Set(shows.map(show => show.screenType))
                ];
                return {
                    ...movieDetail.toObject(),
                    screenTypes,
                    isScheduled: true
                };
            })
        );
        const unmappedMovies = await Movie.find({
            _id: { $nin: mappedMovieIds },
            releaseDate: { $gt: today }
        });

        const upcomingWithoutShows = unmappedMovies.map(movie => ({
            ...movie.toObject(),
            screenTypes: [],
        }));

        const finalMovies = [...mappedMovies, ...upcomingWithoutShows];

        return res.status(200).json({
            success: true,
            data: finalMovies,
        });

    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
};

const getMoviesInCity = async (req, res, next) => {
    try {
        const { id } = req.params;
        const today = new Date();
        const query = `SELECT id,cinemaName,cinemaLandmark FROM cinema where cityId=? and status=?`;
        const param = [id, 1];
        const [CinemaResponse] = await pool.execute(query, param);
        const allMovies = [];

        for (const cinema of CinemaResponse) {
            const movies = await Show.find({
                cinemaId: cinema.id,
                showStartTime: { $gte: today },
            });
            allMovies.push(...movies);
        }

        const resultMap = new Map();
        for (const show of allMovies) {
            {
                const language = show.movieLanguage;
                const movieId = show.movieId.toString();
                const movieDetail = await Movie.findById({ _id: movieId });
                if (!resultMap.has(language)) {
                    resultMap.set(language, new Map());
                }

                const moviesMap = resultMap.get(language);

                if (!moviesMap.has(movieId)) {
                    moviesMap.set(movieId, {
                        movieId: movieId,
                        movieName: show.movieName,
                        movieType: movieDetail.movieType,
                        screenTypes: new Set(),
                    });
                }
                moviesMap.get(movieId).screenTypes.add(show.screenType);
            }
        }

        const finalResult = Array.from(resultMap.entries()).map(
            ([language, moviesMap]) => ({
                language,
                movies: Array.from(moviesMap.values()).map((movie) => ({
                    movieId: movie.movieId,
                    movieName: movie.movieName,
                    movieType: movie.movieType,
                    screenTypes: Array.from(movie.screenTypes),
                })),
            })
        );
        return res.status(200).json({
            success: true,
            data: finalResult,
        });
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
};

const getSingleMovie = async (req, res, next) => {
    try {
        const id = req.params.id;
        const today = new Date();
        const movieData = await Movie.findById({ _id: id });
        if (!movieData) return next(new errorHandler("Movie not found", 401));
        const userRating = await Rating.findOne({ movieId: id });
        const getMovie = await Show.find({
            movieId: id,
            showStartTime: { $gte: today },
        });

        const getScreenTypeArrayAll = getMovie.map((item) => item.screenType);
        const screenTypes = [...new Set(getScreenTypeArrayAll)];

        const getScreenTypeArray = getMovie.map((item) => {
            return {
                screenType: item.screenType,
                language: item.movieLanguage,
            };
        });

        const resultMap = new Map();

        getScreenTypeArray.forEach(({ language, screenType }) => {
            if (!resultMap.has(language)) {
                resultMap.set(language, new Set());
            }
            resultMap.get(language).add(screenType);
        });

        const availableScreen = Array.from(resultMap.entries()).map(
            ([language, screenTypes]) => ({
                language,
                screenType: Array.from(screenTypes),
            })
        );

        let ratingData = {};
        if (userRating !== null) {
            ratingData = {
                totalRating: userRating.totalRating,
                votes: userRating.userRatings.length,
            };
        }

        const data = {
            ...movieData.toObject(),
            screenTypes,
            availableScreen,
            ratingData,
        };

        return res.status(200).json({
            success: true,
            message: "Movie get successfully",
            data: data,
        });
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
};

module.exports = { getAllCity, getAllCinemaByCity, getSingleMovie, getShow, getAllCinemaByFilter, getMovieforcinema, getMoviesInCity, getMoviesInCinema, getLatestMovie, getUpCommingMovie };
