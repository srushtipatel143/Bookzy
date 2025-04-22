const { pool } = require("../../config/dbConn");
const errorHandler = require("../../helpers/errors/errorHandler");

const addCity = async (req, res, next) => {
    try {
        const { city, state, country } = req.body;
        const { id } = req.admin;
        const callProcedure = `CALL addCity(?, ?, ?, ?)`;
        const param = [id, city, state, country];
        await pool.execute(callProcedure, param)
        return res.status(200).json({ success: true, message: "city added successfully", data: req.body })
    } catch (error) {
        return next(new errorHandler("Databaseb error", 500, error));
    }
};

const getSingleCity = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId=req.admin.id;
        const getCityQuery = `select userId,city,state,country from city where id=? and userId=?`;
        const [getCityRes] = await pool.execute(getCityQuery, [id,userId]);
        return res.status(200).json({ success: true, message: "city get successfully", data: getCityRes })
    } catch (error) {
        return next(new errorHandler("Database error", 500, error));
    }
};

const getCityByUSer = async (req, res, next) => {
    try {
        const { id } = req.admin;
        const getCityQuery = `select id,city,state,country from city where userId=?`;
        const [getCityRes] = await pool.execute(getCityQuery, [id]);
        return res.status(200).json({ success: true, message: "city get successfully", data: getCityRes })
    } catch (error) {
        return next(new errorHandler("Databaseb error", 500, error));
    }
};

const editCity = async (req, res, next) => {
    try {
        const { id, city, state, country } = req.body;
        const userId=req.admin.id;
        const callProcedure = `CALL updateCity(?, ?, ?, ?,?)`;
        const param = [id, city, state, country,userId];
        await pool.execute(callProcedure, param);
        return res.status(200).json({ success: true, message: "city update successfully", data: req.body })
    } catch (error) {
        return next(new errorHandler("Databaseb error", 500, error));
    }
};

module.exports = { addCity, getSingleCity, getCityByUSer, editCity };