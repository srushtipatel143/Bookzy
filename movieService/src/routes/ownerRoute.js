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
router.get("/getscreenbycinemaid/:id",getAccessToRoute,getScreenByCinemaId);

router.post("/addshow",getAccessToRoute,addShow);
router.put("/editshow",getAccessToRoute,editShow);
router.get("/getshow/:id",getAccessToRoute,getShow);
router.get("/getshowbybinemaid",getAccessToRoute,getShowByCinemaId);

module.exports=router;