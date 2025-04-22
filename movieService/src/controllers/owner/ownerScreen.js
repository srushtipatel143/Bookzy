const { pool } = require("../../config/dbConn");
const errorHandler = require("../../helpers/errors/errorHandler");

const addScreen = async (req, res, next) => {
    let conn;
    try {
        const data = req.body;
        const userId=req.owner.id;
        const screenData = data.screens.map(item => ({
            cinemaId: data.cinemaId,
            screenName: item.screenName,
            noOfRows: item.noOfRows,
            totalNoOFSeats: item.totalNoOFSeats
        }));

        conn = await pool.getConnection();
        if (!conn) throw new Error('Failed to establish a database connection');

        await conn.beginTransaction();

        const checkValidUserQuery=`select count(*) as validUser from  cinema where id=? and userId=?`;
        const [iSvalidUser]=await conn.execute(checkValidUserQuery,[data.cinemaId,userId]);
        if(iSvalidUser[0].validUser===0){
            await conn.rollback();
            return res.status(403).json({ message: `User is not authorized` });
        }

        // Insert screens
        const screenParam = JSON.stringify(screenData);
        const [insertScreenQueryResponse] = await conn.execute(`CALL addScreen(?)`, [screenParam]);


        // Safely access the first insert ID
        const firstInsertId = insertScreenQueryResponse[0][0].insertId;
        if (!firstInsertId) throw new Error('Failed to retrieve insert ID for screens');

        // Prepare row data
        const rowsInfo = [];
        data.screens.forEach((item, index) => {
            const screenId = firstInsertId + index;
            item.rowsInfo.forEach(row => {
                rowsInfo.push({
                    screenId: screenId,
                    rowName: row.rowName,
                    noOfRowSeat: row.noOfRowSeat,
                    rowType: row.rowType
                });
            });
        });

        const rowParam = JSON.stringify(rowsInfo);
        const [insertRowQueryResponse] = await conn.execute(`CALL addRow(?)`, [rowParam]);

        const firstRowInsertId = insertRowQueryResponse[0][0].insertId;
        if (!firstRowInsertId) throw new Error('Failed to retrieve insert ID for rows');

        // Prepare seat data
        const seatInfoArray = [];
        data.screens.forEach((item, index) => {
            const screenId = firstInsertId + index;

            item.rowsInfo.forEach((row, ind) => {
                const rowId = firstRowInsertId + ind;

                for (let i = row.seatStartFrom; i <= row.seatEndTo; i++) {
                    seatInfoArray.push({
                        rowId,
                        screenId,
                        cinemaId: data.cinemaId,
                        seatname: `${row.rowName}${i}`
                    });
                }
            });
        });

        const seatParam = JSON.stringify(seatInfoArray);
        await conn.execute(`CALL addSeat(?)`, [seatParam]);
        
        const updateQuery = `update cinema set noOfScreen=noOfScreen + ? where id=?`;
        const paramVal = [data.screens.length, data.cinemaId];
        await conn.execute(updateQuery, paramVal);

        await conn.commit();
        return res.status(200).json({ message: `Screen, Row, and Seat added successfully` });

    } catch (error) {
        if (conn) await conn.rollback();
        return next(new errorHandler("Database error", 500, error));
    } finally {
        if (conn) conn.release();
    }
};

const getScreenByCinemaId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId=req.owner.id;
        // const query = `SELECT seatinfo.screenId as screenId,screenName,screen.noOfRows as screenRow,screen.noOfSeats as screenSeat,seatinfo.RowId as rowId,
        // rowName,rowType,rowsinfo.noOfRowSeat as rowSeat,seatinfo.id as seatId,seatName FROM booking.seatinfo
        // join rowsinfo on rowsinfo.id=seatinfo.RowId
        // join screen on seatinfo.screenId=screen.id where screen.cinemaId=?`;
        const query=`SELECT seatinfo.screenId as screenId,screenName,screen.noOfRows as screenRow,screen.noOfSeats as screenSeat,
        seatinfo.RowId as rowId,rowName,rowType,rowsinfo.noOfRowSeat as rowSeat,seatinfo.id as seatId,seatName 
        FROM booking.seatinfo
        join rowsinfo on rowsinfo.id=seatinfo.RowId
        join screen on seatinfo.screenId=screen.id
        join cinema on cinema.id=screen.cinemaId
        where screen.cinemaId=?  and cinema.userId=?`
        const [response] = await pool.execute(query, [id,userId]);
        const screenMap = new Map();
        const screenData = [];
        for (const item of response) {
            if (!screenMap.has(item.screenId)) {
                const newData = {
                    screenId: item.screenId,
                    screenName: item.screenName,
                    screenRow: item.screenRow,
                    screenSeat: item.screenSeat,
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
        return res.status(200).json({message:"get screen successfully",data:screenData})
    } catch (error) {
        return next(new errorHandler("Database error", 500, error));
    }
}
module.exports = { addScreen, getScreenByCinemaId };

