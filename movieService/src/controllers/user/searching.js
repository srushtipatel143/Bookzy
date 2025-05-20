const errorHandler = require("../../helpers/errors/errorHandler");
const { pool } = require("../../config/dbConn");
const Movie = require("../../models/movieInfoModel");

const searchCity = async (req, res, next) => {
    try {
        const { val } = req.params;
        const searchPattern = `%${val.toLowerCase()}%`;
        const query = `SELECT id,city,state,country FROM city where city LIKE ?`;
        const [cityResponse] = await pool.execute(query, [searchPattern]);
        return res.status(200).json({ message: "get city successfully", data: cityResponse })
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
}

const searchMovieCinema = async (req, res, next) => {
    try {
        const { val } = req.params;
        const searchPattern = `%${val.toLowerCase()}%`;
        const query = `
            SELECT cinema.id AS id,CONCAT(cinemaName, ': ', cinemaLandmark, ', ', city) AS cinemaname 
            FROM cinema
            JOIN city ON city.id = cinema.cityId 
            WHERE LOWER(CONCAT(cinemaName, ': ', cinemaLandmark, ', ', city)) LIKE ?
        `;
        const [cinemaResults] = await pool.execute(query, [searchPattern]);
        const movieResults = await Movie.find({
            title: { $regex: val, $options: 'i' }
        });
        const formattedMovies = movieResults.map(item => ({
            id: item._id,
            title: item.title
        }));
        const data = [...cinemaResults,...formattedMovies]
        return res.status(200).json({ message: "Fetched cinemas and movies successfully", data });
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
};


module.exports = { searchCity, searchMovieCinema }