const express=require("express");
const app=express();
const errorHandler = require("./helpers/errors/errorHandler");
const cors=require("cors");
app.use(express.json());

const adminRouter=require("./routes/adminRoutes");
const ownerRouter=require("./routes/ownerRoutes");
const userRouter=require("./routes/userRoutes");


app.use("/api/auth/admin",adminRouter);
app.use("/api/auth/owner",ownerRouter);
app.use("/api/auth/user",userRouter);

app.use(cors());

app.use((err, req, res, next) => {
    if (err instanceof errorHandler) {
        return res.status(err.statusCode).json({
            statusCode:err.statusCode,
            message: err.message,
            error: err.error || "No additional details provided",
        });
    }
    return res.status(500).json({
        error: "Internal Server Error",
        status: 500,
    });
});

module.exports=app;