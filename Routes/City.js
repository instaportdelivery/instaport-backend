const express=require("express");
const router=express.Router();
const { createCity,getCity } = require("../Controllers/City");
const{AdminToken} =require("../Middlewares/AdminAuth");

router.post("/create",AdminToken,createCity);
router.get("/getcity",getCity);

module.exports = router;