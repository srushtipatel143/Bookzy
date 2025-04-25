const Show = require("../../models/showInformationModel");
const errorHandler = require("../../helpers/errors/errorHandler");
const Movie = require("../../models/movieInfoModel");
const { pool } = require("../../config/dbConn");
const cinemaMovieMapping = require("../../models/cinemaMovieMappingCollection")
const cityMovieMapping = require("../../models/cityMovieMappingCollection");

const addShow = async (req, res, next) => {
    const session = await Movie.startSession();
    const conn = await pool.getConnection();
    try {
        const data = req.body;
        const { id } = req.owner;
        await session.startTransaction();

        const isValidUserQuery = `select count(*) as isValidUser,cityId from cinema where id=? and userId=? group by id`;
        const [isValidUserRes] = await conn.execute(isValidUserQuery, [data.cinemaId, id]);
        if (isValidUserRes[0].isValidUser === 0) {
            await session.abortTransaction();
            await session.endSession();
            return next(new errorHandler("User is not authorized", 401));
        }

        const movie = await Movie.findById({ _id: data.movieId });
        if (!movie) {
            await session.abortTransaction();
            await session.endSession();
            return next(new errorHandler("Movie not found", 404));
        }
        const showStartTime = new Date(data.showStartTime);
        const showEndTime = new Date(showStartTime.getTime() + movie.duration * 60000);

        const overlappingShow = await Show.findOne({
            screenId: data.screenId,
            $and: [{
                showStartTime: { $lte: showEndTime, $gte: showStartTime }
            }]
        }).session(session);

        if (overlappingShow) {
            await session.abortTransaction();
            await session.endSession();
            return next(new errorHandler("Another show is already scheduled during this time on the same screen", 409));
        }

        const show = new Show({ ...data, userId: id });
        const showData = await show.save({ session });
        await conn.beginTransaction();
        
        // start city movie mapping

        const existingCityMovieEntry = await cityMovieMapping.findOne({
            cityId: isValidUserRes[0].cityId,
            movieId: data.movieId
        })

        if (existingCityMovieEntry) {
            console.log(existingCityMovieEntry.expiresAt, showEndTime, existingCityMovieEntry.expiresAt < showEndTime)
            if (existingCityMovieEntry.expiresAt < showEndTime) {
                await existingCityMovieEntry.updateOne(
                    {

                        $set: {
                            showTime: data.showStartTime,
                            showDate: data.showDate,
                            expiresAt: showEndTime
                        }
                    },
                    { session }
                );
            }
        }
        else {
            const cityMappingData = new cityMovieMapping({
                cityId: isValidUserRes[0].cityId,
                movieId: data.movieId,
                movieReleaseDate: movie.releaseDate,
                showTime: data.showStartTime,
                showDate: data.showDate,
                expiresAt: showEndTime
            });
            await cityMappingData.save({ session });
        }
        //end city movie mapping 


        //start cinema movie mapping

        const existingCinemaMovieEntry = await cinemaMovieMapping.findOne({
            cinemaId: data.cinemaId,
            movieId: data.movieId
        })

        if (existingCinemaMovieEntry) {
            if (existingCinemaMovieEntry.expiresAt < showEndTime) {
                await existingCinemaMovieEntry.updateOne(
                    {
                        $set: {
                            showTime: data.showStartTime,
                            showDate: data.showDate,
                            expiresAt: showEndTime
                        }
                    },
                    { session }
                );
            }

        }
        else {
            const cinemaMappingData = new cinemaMovieMapping({
                cinemaId: data.cinemaId,
                movieId: data.movieId,
                movieReleaseDate: movie.releaseDate,
                showTime: data.showStartTime,
                showDate: data.showDate,
                expiresAt: showEndTime
            });
            await cinemaMappingData.save({ session });
        }

        //end cinema movie mapping


        const getSeatQuery = `SELECT seatinfo.cinemaId as cinemaId,seatinfo.screenId as screenId,
        rowName,seatName FROM seatinfo
        join rowsinfo on rowsinfo.id=seatinfo.RowId
        join screen on seatinfo.screenId=screen.id where screen.id=?`;

        const [getSeatDataForShow] = await pool.execute(getSeatQuery, [data.screenId]);
        const showId = showData._id.toString();
        const updateData = getSeatDataForShow.map((item) => ({
            ...item,
            showId: showId,
            movieId: data.movieId
        }));


        try {
            await conn.execute(`CALL addSeatBookingData(?)`, [updateData]);

            await session.commitTransaction();
            await conn.commit();

            return res.status(200).json({
                success: true,
                message: "Show added successfully",
                data: showData
            });
        } catch (mysqlError) {
            await session.abortTransaction();
            await conn.rollback();
            return next(new errorHandler("MySQL transaction failed", 500, mysqlError));
        }
        finally {
            conn.release();
            session.endSession();
        }
    } catch (error) {
        console.log(error)
        await session.abortTransaction();
        await conn.rollback();
        return next(new errorHandler("Database error", 500, error));
    }
}

const editShow = async (req, res, next) => {
    try {
        const data = req.body;
        const { id } = req.owner;
        const { showId, movieLanguage, showStartTime, priceInfoForShow, cinemaId, screenType } = data;
        const isValidUserQuery = `select count(*) as isValidUser from cinema where id=? and userId=?`;
        const [isValidUserRes] = await pool.execute(isValidUserQuery, [cinemaId, id]);

        if (isValidUserRes[0].isValidUser === 0) {
            return next(new errorHandler("User is not authorized", 401));
        }

        const updateObject = {
            movieLanguage,
            showStartTime,
            priceInfoForShow,
            screenType
        };
        await Show.updateOne({ _id: showId, $set: updateObject });
        return res.status(200).json({
            success: true,
            message: "Show update successfully",
            data: data
        });

    } catch (error) {
        console.log(error)
        return next(new errorHandler("Database error", 500, error));
    }
}

const getShow = async (req, res, next) => {
    try {
        //const { screenId, showId } = req.body;
        const showId = req.params.id;

        const showData = await Show.findOne({ _id: showId });

        // const query = `SELECT seatinfo.screenId as screenId,screenName,screen.noOfRows as screenRow,screen.noOfSeats as screenSeat,seatinfo.RowId as rowId,
        // rowName,rowType,rowsinfo.noOfRowSeat as rowSeat,seatinfo.id as seatId,seatName FROM booking.seatinfo
        // join rowsinfo on rowsinfo.id=seatinfo.RowId
        // join screen on seatinfo.screenId=screen.id where screen.id=?`;
        // const [response] = await pool.execute(query, [screenId]);
        // const screenMap = new Map();
        // const screenData = [];

        // for (const item of response) {
        //     if (!screenMap.has(item.screenId)) {
        //         const newData = {
        //             movieId: showData.movieId,
        //             screenId: item.screenId,
        //             screenName: item.screenName,
        //             screenRow: item.screenRow,
        //             screenSeat: item.screenSeat,
        //             language: showData.movieLanguage,
        //             showTime: showData.showStartTime,
        //             rows: []
        //         };
        //         screenMap.set(item.screenId, newData);
        //         screenData.push(newData);
        //     }
        //     const existingScreen = screenMap.get(item.screenId);
        //     let existingRow = existingScreen.rows.find(r => r.rowId === item.rowId);
        //     if (!existingRow) {
        //         existingRow = {
        //             rowId: item.rowId,
        //             rowName: item.rowName,
        //             rowType: item.rowType,
        //             rowSeat: item.rowSeat,
        //             price: showData.priceInfoForShow.find((val) => val.rowType === item.rowType)?.price || 0,
        //             seats: []
        //         };
        //         existingScreen.rows.push(existingRow);
        //     }
        //     if (!existingRow.seats.some(s => s.seatId === item.seatId)) {
        //         existingRow.seats.push({
        //             seatId: item.seatId,
        //             seatName: item.seatName
        //         });
        //     }
        // }
        return res.status(200).json({ message: "get show successfully", data: showData })

    } catch (error) {
        return next(new errorHandler("Database error", 500, error));
    }
}

const getShowByCinemaId = async (req, res, next) => {
    try {
        const data = req.body;
        const showData = await Show.find({ cinemaId: data.cinemaId, screenId: data.screenId });
        return res.status(200).json({
            success: true,
            message: "Show got successfully",
            data: showData
        });

    } catch (error) {
        return next(new errorHandler("Database error", 500, error));
    }
}

module.exports = { addShow, editShow, getShow, getShowByCinemaId };


