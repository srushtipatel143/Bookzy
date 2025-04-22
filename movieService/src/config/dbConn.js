require("dotenv").config();
const mongoose=require("mongoose");
const mysql=require("mysql2");

const MONGO_URL=process.env.MONGO_URL;
mongoose.connect(MONGO_URL)

const pool=mysql.createPool({
   host:process.env.HOST,
   user:process.env.USER,
   password:process.env.PASSWORD,
   database:process.env.DATABASE,
   connectionLimit:10,
   waitForConnections: true,
}).promise();

module.exports={pool,MONGO_URL,mongoose};
