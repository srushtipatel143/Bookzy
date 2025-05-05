const express=require("express");
const router=express.Router();
const {addCity,getCityByUSer,getSingleCity,editCity}=require("../controllers/admin/adminCity");
const {getAccessToRouteBoth}=require("../middlewares/authorization/authAdminOrMasterAdmin")
const {addMovie,updateMovie,getAllMovie,getSingleMovie}=require("../controllers/admin/adminMovie");


router.post("/addcity",getAccessToRouteBoth,addCity);
router.get("/getcity/:id",getAccessToRouteBoth,getSingleCity);
router.get("/getallcity",getAccessToRouteBoth,getCityByUSer);
router.put("/editcity",getAccessToRouteBoth,editCity)

router.post("/addmovie",getAccessToRouteBoth,addMovie)
router.put("/updatemovie",getAccessToRouteBoth,updateMovie)
router.get("/getallmovie",getAccessToRouteBoth,getAllMovie)
router.get("/getsinglemovie/:id",getAccessToRouteBoth,getSingleMovie)

module.exports=router;