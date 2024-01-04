const express = require("express")
const {priceManipulation, updatePriceManipulation, getPriceManipulation} = require("../Controllers/PriceManipulation");
const {AdminToken}=require("../Middlewares/AdminAuth");
const router = express.Router();

router.get("/get",getPriceManipulation);
router.post("/create",AdminToken,priceManipulation);
router.patch("/update",AdminToken,updatePriceManipulation);

module.exports = router;