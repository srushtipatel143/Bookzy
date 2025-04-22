const express=require("express");
const router=express.Router();
const {signup,resendOtp,validateOtp,signIn,editProfile}=require("../controllers/user/signup");
const {getAccessToUserRoute}=require("../middlewares/authorization/authUser");

router.post("/signup",signup);
router.post("/resendotp",resendOtp);
router.post("/validateotp",validateOtp)
router.post("/signin",signIn);
router.put("/editprofile",getAccessToUserRoute,editProfile)
module.exports=router;