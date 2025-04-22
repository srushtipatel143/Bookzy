const express=require("express");
const router=express.Router();
const {addCity,getCityByUSer,getSingleCity,editCity}=require("../controllers/admin/adminCity");
const {getAccessToRouteBoth}=require("../middlewares/authorization/authAdminOrMasterAdmin")
const {addMovie,updateMovie,getAllMovie,getSingleMovie}=require("../controllers/admin/adminMovie");


router.post("/addcity",getAccessToRouteBoth,addCity);
router.get("/getcity/:id",getAccessToRouteBoth,getSingleCity);
router.get("/getallcity",getAccessToRouteBoth,getCityByUSer);
router.put("/editcity",getAccessToRouteBoth,editCity)

router.post("/addMovie",getAccessToRouteBoth,addMovie)
router.put("/updateMovie",getAccessToRouteBoth,updateMovie)
router.get("/getAllMovie",getAccessToRouteBoth,getAllMovie)
router.get("/getSingleMovie/:id",getAccessToRouteBoth,getSingleMovie)

module.exports=router;