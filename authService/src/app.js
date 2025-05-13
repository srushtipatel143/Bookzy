const express = require("express");
const app = express();
const errorHandler = require("./helpers/errors/errorHandler");
const cors = require("cors");
const cookieparser=require("cookie-parser");
app.use(express.json());
const allowedOrigins = ['http://localhost:3000'];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true)
        }
        else {
            return callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true
}));

app.use(cookieparser());

const adminRouter = require("./routes/adminRoutes");
const ownerRouter = require("./routes/ownerRoutes");
const userRouter = require("./routes/userRoutes");

app.use("/api/auth/admin", adminRouter);
app.use("/api/auth/owner", ownerRouter);
app.use("/api/auth/user", userRouter);

app.use((err, req, res, next) => {
    if (err instanceof errorHandler) {
        return res.status(err.statusCode).json({
            statusCode: err.statusCode,
            message: err.message,
            error: err.error || "No additional details provided",
        });
    }
    return res.status(500).json({
        error: "Internal Server Error",
        status: 500,
    });
});

module.exports = app;