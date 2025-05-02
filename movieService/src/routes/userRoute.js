const express=require("express");
const router=express.Router();
const {getAllCity,getAllCinemaByCity,getSingleMovie,getShow,getMovieforcinema,getMoviesInCity,getMoviesInCinema,getLatestMovie,getUpCommingMovie,getAllCinemaByFilter}=require("../controllers/user/userWork");
const {addRating,getSingleMovieRatings}=require("../controllers/user/userRating");
const {getAccessToUserRoute}=require("../middlewares/authorization/authUser");

router.get("/getAllCity",getAllCity);
router.get("/getAllCinemaByCity/:id",getAllCinemaByCity);
router.get("/getSingleMovie/:id",getSingleMovie);
router.get("/getshowinfo/:id",getShow)
router.get("/getMovieforcinema",getMovieforcinema);
router.get("/getmoviesincity/:id",getMoviesInCity);
router.get("/getmoviesincinema/:id",getMoviesInCinema);
router.get("/getlatestmovie/:id",getLatestMovie);
router.get("/upcomingmovie/:id",getUpCommingMovie)
router.get("/getallcinemabyfilter",getAllCinemaByFilter)

router.post("/addRating",getAccessToUserRoute,addRating);
router.get("/getSingleMovieRatings/:id",getSingleMovieRatings)

module.exports=router;