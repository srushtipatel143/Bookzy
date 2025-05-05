require("dotenv").config();
const mongoose=require("mongoose");

const MONGO_URL=process.env.MONGO_URL;

mongoose.connect(MONGO_URL).then(()=>{
    console.log("Database connection successful");
}).catch((err)=>{
    return next(new errorHandler("Something went wrong", 500, err));
})

module.exports={mongoose,MONGO_URL};