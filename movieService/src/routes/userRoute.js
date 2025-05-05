const express=require("express");
const router=express.Router();
const {getAllCity,getAllCinemaByCity,getSingleMovie,getShow,getMovieforcinema,getMoviesInCity,getMoviesInCinema,getLatestMovie,getUpCommingMovie,getAllCinemaByFilter}=require("../controllers/user/userWork");
const {addRating,getSingleMovieRatings}=require("../controllers/user/userRating");
const {getAccessToUserRoute}=require("../middlewares/authorization/authUser");

router.get("/getallcity",getAllCity);
router.get("/getallcinemabycity/:id",getAllCinemaByCity);
router.get("/getsinglemovie/:id",getSingleMovie);
router.get("/getshowinfo/:id",getShow)
router.get("/getmovieforcinema",getMovieforcinema);
router.get("/getmoviesincity/:id",getMoviesInCity);
router.get("/getmoviesincinema/:id",getMoviesInCinema);
router.get("/getlatestmovie/:id",getLatestMovie);
router.get("/upcomingmovie/:id",getUpCommingMovie)
router.get("/getallcinemabyfilter",getAllCinemaByFilter)

router.post("/addrating",getAccessToUserRoute,addRating);
router.get("/getsinglemovieratings/:id",getSingleMovieRatings)

module.exports=router;