const express = require("express");
const router = express.Router();
const { userSignup, userSignin, userUpdate, userData, allUsers, getUserValidity } = require("../Controllers/User");
const { CustomerToken } = require('../Middlewares/CustomerAuth');
const { AdminToken } = require("../Middlewares/AdminAuth");

router.get("/users", AdminToken, allUsers);
router.post("/signup", userSignup);
router.post("/signin", userSignin);
router.patch("/update", CustomerToken, userUpdate);
router.get("/", CustomerToken, userData);
router.post("/get-validity", getUserValidity);


module.exports = router;