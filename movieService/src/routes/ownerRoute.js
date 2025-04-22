const express=require("express");
const router=express.Router();
const {addCinema,getSingleCinema,getCinemaByUSer,editCinema}=require("../controllers/owner/ownerCinema");
const {addScreen,getScreenByCinemaId}=require("../controllers/owner/ownerScreen")
const {getAccessToRoute}=require("../middlewares/authorization/authOwner");
const {addShow,editShow,getShow,getShowByCinemaId}=require("../controllers/owner/ownerShow");

router.post("/addcinema",getAccessToRoute,addCinema);
router.get("/getcinema/:id",getAccessToRoute,getSingleCinema);
router.get("/getallcinema",getAccessToRoute,getCinemaByUSer);
router.put("/editcinema",getAccessToRoute,editCinema);

router.post("/addscreen",getAccessToRoute,addScreen);
router.get("/getScreenByCinemaId/:id",getAccessToRoute,getScreenByCinemaId);

router.post("/addShow",getAccessToRoute,addShow);
router.put("/editShow",getAccessToRoute,editShow);
router.get("/getShow/:id",getAccessToRoute,getShow);
router.get("/getShowByCinemaId",getAccessToRoute,getShowByCinemaId);

module.exports=router;