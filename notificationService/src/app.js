const express=require("express");
const app=express();
app.use(express.json());

const {init}=require("./kafka/kafka");
init();


module.exports=app;