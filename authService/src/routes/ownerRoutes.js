const express=require("express");
const router=express.Router();
const {createOwner}=require("../controllers/owner/createOwner");
const {getSingleOwner}=require("../controllers/owner/getSingleOwner");
const {getAllOwner}=require("../controllers/owner/getAllOwner");
const {deleteOwner}=require("../controllers/owner/deleteOwner");
const {editOwner}=require("../controllers/owner/editOwner");
const {ownerLogin,resetPassword, setForgotPassword,logout,editProfile,getUserDetail,changePassword}=require("../controllers/owner/ownerController");
const {getAccessToRouteBoth}=require("../middlewares/authorization/authAdminOrMasterAdmin");
const {getAccessToRoute}=require("../middlewares/authorization/authOwner")

router.post("/ownerlogin",ownerLogin)
router.post("/createowner",getAccessToRouteBoth,createOwner);
router.get("/getsingleowner/:id",getAccessToRouteBoth,getSingleOwner)
router.get("/getallowner",getAccessToRouteBoth,getAllOwner);
router.put("/deleteowner/:id",getAccessToRouteBoth,deleteOwner);
router.put("/editowner",getAccessToRouteBoth,editOwner);
router.put("/resetpassword",resetPassword)
router.put("/setforgotpassword",setForgotPassword)

router.put("/editprofile",getAccessToRoute,editProfile);
router.get("/getuser",getAccessToRoute,getUserDetail)
router.put("/changepassword",getAccessToRoute,changePassword)
router.get("/logout",logout);

module.exports=router;