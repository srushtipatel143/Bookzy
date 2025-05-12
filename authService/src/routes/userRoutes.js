const express=require("express");
const router=express.Router();
const {resendOtp,validateOtp,signIn,editProfile,getUserDetail}=require("../controllers/user/signup");
const {getAccessToUserRoute}=require("../middlewares/authorization/authUser");

router.post("/resendotp/:id",resendOtp);
router.post("/validateotp",validateOtp)
router.post("/signin",signIn);
router.put("/editprofile",getAccessToUserRoute,editProfile);
router.get("/getuser",getAccessToUserRoute,getUserDetail)

module.exports=router;