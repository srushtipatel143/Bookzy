const Razorpay = require("razorpay");
const crypto = require("crypto");
const errorHandler = require("../../helpers/errors/errorHandler");
const { Razor_Key_ID, Razor_Secret_Key } = process.env;
const Booking = require("../../models/bookingModel");
const Payment = require("../../models/payment");
const { pool } = require("../../config/dbConn");

function prepareInClause(baseQuery, arrayParams) {
    const placeholders = arrayParams.map(() => '?').join(',');
    return baseQuery.replace('(?)', `(${placeholders})`);
}

const razorpay = new Razorpay({
    key_id: Razor_Key_ID,
    key_secret: Razor_Secret_Key,
});

const CreateOrder = async (req, res, next) => {
    try {
        const data = req.body;
        const selectSeats = data.ticket;

        const seatVal = selectSeats.flatMap(val => val.seats.map(item => item.id));

        const time = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const seatPlaceholders = seatVal.map(() => '?').join(', ');
        const sql = `
            SELECT id, ABS(TIMESTAMPDIFF(MINUTE, ?, selectTime)) AS diffMinutes
            FROM seatbooking
            WHERE userId = ? AND id IN (${seatPlaceholders})
            HAVING diffMinutes > 10`;

        const [rows] = await pool.execute(sql, [time, data.userId, ...seatVal]);


        if (rows.length > 0) {
            return res.status(429).json({ message: "Time is expired" });
        }

        const order = await razorpay.orders.create({
            amount: data.totalAmount * 100,
            currency: "INR",
            receipt: "receipt#1",
        });
        return res.json({ success: true, order });
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
};

const verifyOrder = async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            req.body;
        const body = `${razorpay_order_id}|${razorpay_payment_id}`;

        const expectedSignature = crypto.createHmac("sha256", Razor_Secret_Key).update(body).digest("hex");

        if (expectedSignature === razorpay_signature) {
            const payment = await razorpay.payments.fetch(razorpay_payment_id);

            return res.json({
                success: true, message: "Payment verified successfully", data: {
                    order_id: razorpay_order_id,
                    payment_id: razorpay_payment_id,
                    method: payment.method,
                    currency: payment.currency
                }
            });
        }
        else {
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
};

const selectSeatBeforePayment = async (req, res, next) => {
    try {
        const data = req.body;
        const selectSeats = data.selectSeats;
        const conn = await pool.getConnection();

        if (!Array.isArray(selectSeats) || selectSeats.length === 0) {
            return res.status(400).json({ success: false, message: "No seats selected" });
        }

        const seatVal = selectSeats.map(val => val.id);
        const time = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const seatPlaceholders = seatVal.map(() => '?').join(', ');
        const sql = `
            SELECT id, ABS(TIMESTAMPDIFF(MINUTE, ?, selectTime)) AS diffMinutes
            FROM seatbooking
            WHERE userId != ? AND id IN (${seatPlaceholders})
            HAVING diffMinutes < 10`;

        const [rows] = await pool.execute(sql, [time, data.userId, ...seatVal]);

        if (rows.length > 0) {
            return res.status(429).json({ message: "Another process is running" });
        }

        const baseQuery = 'UPDATE seatbooking SET selectTime=?, userId = ?, status = ? WHERE id IN (?)';
        console.log(time)
        const finalQuery = prepareInClause(baseQuery, seatVal);
        await conn.execute(finalQuery, [time, data.userId, 'Processing', ...seatVal]);

        const rowTypeMap = new Map();

        selectSeats.forEach(({ rowType, seatName, price, rowName, id }) => {
            if (!rowTypeMap.has(rowType)) {
                rowTypeMap.set(rowType, {
                    rowType,
                    seats: []
                });
            }
            rowTypeMap.get(rowType).seats.push({ seatName, price, rowName, id });
        });

        const amount = selectSeats.reduce((acc, v) => acc + (v.price || 0), 0);
        const convenienceFee = +(amount * 0.18).toFixed(2);
        const totalAmount = +(amount + convenienceFee).toFixed(2);

        const grouped = {
            userId: data.userId,
            email: data.email,
            mobile: data.mobile,
            firstName: data.firstName,
            cinemaId: selectSeats[0]?.cinemaId,
            movieId: selectSeats[0]?.movieId,
            screenId: selectSeats[0]?.screenId,
            screenName: selectSeats[0]?.screenName,
            showId: selectSeats[0]?.showId,
            amount: amount,
            convenienceFee: convenienceFee,
            totalAmount: totalAmount,
            ticket: Array.from(rowTypeMap.values())
        };

        return res.status(200).json({
            success: true,
            data: grouped,
        });

    } catch (error) {
        console.log(error)
        return next(new errorHandler("Something went wrong", 500, error));
    }
};

const bookingData = async (req, res, next) => {
    try {
        const data = req.body;
        const conn = await pool.getConnection();
        const seatData = data.ticket.flatMap(item => item.seats.map(seat => seat.id));
        const baseQuery = 'UPDATE seatbooking SET status = ? WHERE id IN (?)';
        const finalQuery = prepareInClause(baseQuery, seatData);
        await conn.execute(finalQuery, ['Booked', ...seatData]);

        const ticketData = data.ticket.flatMap(item =>
            item.seats.map(seat => ({
                seatName: seat.seatName,
                rowName: seat.rowName,
                ticketPrice: seat.price,
                ticketGST: (seat.price * 18) / 100,
                seatType: item.rowType
            }))
        );

        const bookingDataValue = {
            showId: data.showId,
            userId: data.userId,
            paymentStatus: 'Booked',
            noOfTickets: ticketData.length,
            totalGST: data.convenienceFee,
            totalTicketPrice: data.amount,
            totalAmount: data.totalAmount,
            tickets: ticketData
        }

        const savedBooking = await new Booking(bookingDataValue).save();

        const paymentData = {
            bookingId: savedBooking._id,
            orderId: data.order_id,
            paymentId: data.payment_id,
            currency: data.currency,
            paymentMethod: data.method
        }
        await new Payment(paymentData).save();

        return res.status(200).json({
            success: true,
            message: "data insert successfully"
        })
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
}

module.exports = { CreateOrder, verifyOrder, selectSeatBeforePayment, bookingData };
