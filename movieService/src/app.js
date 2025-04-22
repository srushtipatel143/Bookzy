const express=require("express");
const app=express();
const errorHandler = require("./helpers/errors/errorHandler")
app.use(express.json());
const adminRouter=require("./routes/adminRoute");
const ownerRouter=require("./routes/ownerRoute");
const userRouter=require("./routes/userRoute");
app.use("/movie/admin",adminRouter);
app.use("/movie/owner",ownerRouter);
app.use("/movie/user",userRouter);

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