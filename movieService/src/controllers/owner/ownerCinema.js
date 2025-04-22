const {pool} = require("../../config/dbConn");
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
        const param=[id, cityId, cinemaName, cinemaLandmark, status, facilityString];
        await pool.query(callProcedure,param);
        return res.status(200).json({ success: true, message: "cinema added successfully", data: req.body })
    } catch (error) {
        return next(new errorHandler("Database error", 500, error));
    } 
}

const getSingleCinema = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.owner.id;
        const getCinemaQuery = `select cinema.id as cinemaId,cinema.userId as userId,cinemaName,cinemaLandmark,cinemastatusenum.status as cinemaStatus,
        noOfScreen,facility,facilityStatus from cinema 
        inner join cinemainformation on cinemainformation.cinemaId=cinema.id
        join  cinemastatusenum on cinemastatusenum.id=cinema.status
        join facilitystatusenum on facilitystatusenum.id=cinemainformation.status
        where cinema.id=? and cinema.status=? and cinema.userId=?`;
        const param=[id,'1',userId]
        const [getCinemaRes] = await pool.execute(getCinemaQuery,param)
                
        const groupedCinemaRes = [];
        const cinemaMap = new Map();
        for (const item of getCinemaRes) {
            if (!cinemaMap.has(item.cinemaId)) {
                const newCinema = {
                    id: item.cinemaId,
                    name: item.cinemaName,
                    landmark: item.cinemaLandmark,
                    status: item.cinemaStatus,
                    screens: item.noOfScreen,
                    facilities: [{ facilityName: item.facility, facilityStatus: item.facilityStatus }]
                }
                cinemaMap.set(item.cinemaId, newCinema);
                groupedCinemaRes.push(newCinema)
            }
            else {
                const existingCinema = cinemaMap.get(item.cinemaId);
                if (!existingCinema.facilities.some(f => f.facilityName === item.facility)) {
                    existingCinema.facilities.push({ facilityName: item.facility, facilityStatus: item.facilityStatus });
                }
            }
        }
        return res.status(200).json({ success: true, message: "cinema get successfully", data: groupedCinemaRes })
    } catch (error) {
        return next(new errorHandler("Databaseb error", 500, error));
    }
}

const getCinemaByUSer = async (req, res, next) => {
    try {
        const { id } = req.owner;
        const getCinemaQuery = `select cinema.id as cinemaId,cinema.userId as userId,cinemaName,cinemaLandmark,cinemastatusenum.status as cinemaStatus,
        noOfScreen,facility,facilityStatus from cinema 
        inner join cinemainformation on cinemainformation.cinemaId=cinema.id
        join  cinemastatusenum on cinemastatusenum.id=cinema.status
        join facilitystatusenum on facilitystatusenum.id=cinemainformation.status
        where cinema.userId=? and cinema.status=?`;
        const param=[id,'1'];
        const [getCinemaRes] = await pool.execute(getCinemaQuery, param);
        const groupedCinemaRes = [];
        const cinemaMap = new Map();
        for (const item of getCinemaRes) {
            if (!cinemaMap.has(item.cinemaId)) {
                const newCinema = {
                    userId: item.userId,
                    id: item.cinemaId,
                    name: item.cinemaName,
                    landmark: item.cinemaLandmark,
                    status: item.cinemaStatus,
                    screens: item.noOfScreen,
                    facilities: [{ facilityName: item.facility, facilityStatus: item.facilityStatus }]
                };

                cinemaMap.set(item.cinemaId, newCinema);
                groupedCinemaRes.push(newCinema);
            } else {
                const existingCinema = cinemaMap.get(item.cinemaId);
                if (!existingCinema.facilities.some(f => f.facilityName === item.facility)) {
                    existingCinema.facilities.push({ facilityName: item.facility, facilityStatus: item.facilityStatus });
                }
            }
        }
        return res.status(200).json({ success: true, message: "cinema get successfully", data: groupedCinemaRes })
    } catch (error) {
        console.log(error)
        return next(new errorHandler("Databaseb error", 500, error));
    }
}

const editCinema = async (req, res, next) => {
    try {
        const {name, landmark, status, facility } = req.body;
        const { id } = req.owner;

        const isMovieNameChangedQuery=`SELECT cinemaName FROM cinema where id=?`;
        const [isMovieNameChanged]=await pool.execute(isMovieNameChangedQuery,[req.body.id]);

        const facilityString = JSON.stringify(facility);
        const editCityQuery = `CALL editCinema(?, ?, ?, ?, ?,?)`;
        const param=[req.body.id,id, name, landmark, status, facilityString]
        await pool.query(editCityQuery,param);

        if(isMovieNameChanged[0].cinemaName!==name){
            await Show.updateMany({cinemaId:req.body.id},{$set:{cinemaName: name}})
        }
        return res.status(200).json({ success: true, message: "cinema update successfully", data: req.body })
    } catch (error) {
        return next(new errorHandler("Databaseb error", 500, error));
    }
}


module.exports = { addCinema, getSingleCinema, getCinemaByUSer, editCinema };