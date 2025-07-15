const { pool } = require("../../config/dbConn");
const errorHandler = require("../../helpers/errors/errorHandler");
const Show = require("../../models/showInformationModel");

const addCinema = async (req, res, next) => {
    try {
        const { cityId, cinemaName, cinemaLandmark, status, facility } = req.body;
        const { id } = req.owner;
        if (!Array.isArray(facility)) {
            return res.status(400).json({ success: false, message: "Invalid facility format" });
        }
        const callProcedure = `CALL addCinema(?, ?, ?, ?, ?, ?)`;
        const facilityString = JSON.stringify(facility);
        const param = [id, cityId, cinemaName, cinemaLandmark, status, facilityString];
        const [rows]=await pool.query(callProcedure, param);
        const insertedId = rows[0][0].insertedId;
        const data={
            ...req.body,
            id:insertedId
        }
        return res.status(200).json({ success: true, message: "cinema added successfully", data:data })
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
}

const getSingleCinema = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.owner.id;
        const getCinemaQuery = `select cinema.id as cinemaId,cinema.userId as userId,cinemaName,cityId,cinemaLandmark,cinema.status as cinemaStatus,
        noOfScreen,facility,cinemainformation.id as faid,cinemainformation.status as facilityStatus from cinema 
        inner join cinemainformation on cinemainformation.cinemaId=cinema.id
        join  cinemastatusenum on cinemastatusenum.id=cinema.status
        join facilitystatusenum on facilitystatusenum.id=cinemainformation.status
        where cinema.id=? and cinema.status=? and cinema.userId=?`;
        const param = [id, '1', userId]
        const [getCinemaRes] = await pool.execute(getCinemaQuery, param)

        const groupedCinemaRes = [];
        const cinemaMap = new Map();
        for (const item of getCinemaRes) {
            if (!cinemaMap.has(item.cinemaId)) {
                const newCinema = {
                    id: item.cinemaId,
                    cityId: item.cityId,
                    cinemaName: item.cinemaName,
                    cinemaLandmark: item.cinemaLandmark,
                    status: item.cinemaStatus,
                    screens: item.noOfScreen,
                    facility: [{id:item.faid,facilityName: item.facility, status: item.facilityStatus }]
                }
                cinemaMap.set(item.cinemaId, newCinema);
                groupedCinemaRes.push(newCinema)
            }
            else {
                const existingCinema = cinemaMap.get(item.cinemaId);
                if (!existingCinema.facility.some(f => f.facilityName === item.facility)) {
                    existingCinema.facility.push({ id:item.faid,facilityName: item.facility, status: item.facilityStatus });
                }
            }
        }
        return res.status(200).json({ success: true, message: "cinema get successfully", data: groupedCinemaRes })
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
}

const getCinemaByUSer = async (req, res, next) => {
    try {
        const { id } = req.owner;

        const query = `SELECT id,city FROM city`;
        const [cityResponse] = await pool.execute(query);

        const querystatus = `SELECT id,status FROM cinemastatusenum`;
        const [statusResponse] = await pool.execute(querystatus);

        const queryfacility = `SELECT id,name FROM cinemaservice;`;
        const [facilityResponse] = await pool.execute(queryfacility);

        const getCinemaQuery = `select cinema.id as cinemaId,cinema.userId as userId,cinemaName,cinemaLandmark,cinemastatusenum.status as cinemaStatus,
        noOfScreen,facility,cinemainformation.status as facilityStatus,city from cinema 
        inner join cinemainformation on cinemainformation.cinemaId=cinema.id
        join  cinemastatusenum on cinemastatusenum.id=cinema.status
        join facilitystatusenum on facilitystatusenum.id=cinemainformation.status
        join city on city.id=cinema.cityId
        where cinema.userId=? and cinema.status=? order by cinemaId`;
        const param = [id, '1'];
        const [getCinemaRes] = await pool.execute(getCinemaQuery, param);
        const groupedCinemaRes = [];
        const cinemaMap = new Map();
        for (const item of getCinemaRes) {
            if (!cinemaMap.has(item.cinemaId)) {
                const newCinema = {
                    userId: item.userId,
                    id: item.cinemaId,
                    cinemaName: item.cinemaName,
                    cinemaLandmark: item.cinemaLandmark,
                    status: item.cinemaStatus,
                    screens: item.noOfScreen,
                    city: item.city,
                    facility: [{ facilityName: item.facility, status: item.facilityStatus }]
                };
                cinemaMap.set(item.cinemaId, newCinema);
                groupedCinemaRes.push(newCinema);
            } else {
                const existingCinema = cinemaMap.get(item.cinemaId);
                if (!existingCinema.facility.some(f => f.facilityName === item.facility)) {
                    existingCinema.facility.push({ facilityName: item.facility, status: item.facilityStatus });
                }
            }
        }

        const data = {
            groupedCinemaRes,
            cityResponse,
            statusResponse,
            facilityResponse
        }
        return res.status(200).json({ success: true, message: "cinema get successfully", data: data })
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
}

const editCinema = async (req, res, next) => {
    try {
        const { cinemaName, cinemaLandmark, status, facility } = req.body;
        const { id } = req.owner;

        const isMovieNameChangedQuery = `SELECT cinemaName FROM cinema where id=?`;
        const [isMovieNameChanged] = await pool.execute(isMovieNameChangedQuery, [req.body.id]);

        const facilityString = JSON.stringify(facility);
        const editCityQuery = `CALL editCinema(?, ?, ?, ?, ?,?)`;
        const param = [req.body.id, id, cinemaName, cinemaLandmark, status, facilityString];
        await pool.query(editCityQuery, param);

        if (isMovieNameChanged[0].cinemaName !== cinemaName) {
            await Show.updateMany({ cinemaId: req.body.id }, { $set: { cinemaName: cinemaName } });
        }
        return res.status(200).json({ success: true, message: "cinema update successfully", data: req.body });
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
}

module.exports = { addCinema, getSingleCinema, getCinemaByUSer, editCinema };