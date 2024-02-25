const express=require("express");
const router = express.Router();
const {userSignup, userSignin, userUpdate,userData, allUsers}=require("../Controllers/User");
const {CustomerToken} =require('../Middlewares/CustomerAuth');
const {AdminToken}=require("../Middlewares/AdminAuth");

router.get("/users",AdminToken,allUsers);
router.post("/signup",userSignup);
router.post("/signin",userSignin);
router.patch("/update",CustomerToken,userUpdate);
router.get("/",CustomerToken,userData);


module.exports=router;