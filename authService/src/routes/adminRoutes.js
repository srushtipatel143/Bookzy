const express=require("express");
const router=express.Router();
const {createAdmin}=require("../controllers/admin/createAdmin");
const {getSingleAdmin}=require("../controllers/admin/getSingleAdmin");
const {getAllAdmin}=require("../controllers/admin/getAllAdmin");
const {deleteAdmin}=require("../controllers/admin/deleteAdmin");
const {editAdmin}=require("../controllers/admin/editAdmin");
const {adminLogin,resetPassword,setForgotPassword}=require("../controllers/admin/adminController");
const {getAccessToRoute}=require("../middlewares/authorization/authMasterAdmin");
const {getAccessToRouteBoth}=require("../middlewares/authorization/authAdminOrMasterAdmin")

//this can done only by master admin
router.post("/adminlogin",adminLogin)
router.post("/createadmin",getAccessToRoute,createAdmin);
router.get("/getalladmin",getAccessToRoute,getAllAdmin);
router.put("/deleteadmin/:id",getAccessToRoute,deleteAdmin);
router.get("/getsingleadmin/:id",getAccessToRoute,getSingleAdmin);

//this can be done by both master admin and admin
router.put("/resetpassword",resetPassword)
router.put("/setforgotpassword",setForgotPassword)
router.put("/editadmin",getAccessToRouteBoth,editAdmin);



module.exports=router;