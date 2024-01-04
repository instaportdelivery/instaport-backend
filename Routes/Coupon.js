const express = require("express");
const router = express.Router();
const { createCoupon, getAllCoupons, getCouponByCodeOrId, updateCoupon } = require("../Controllers/Coupon");
const { AdminToken } = require("../Middlewares/AdminAuth");


router.post("/create", createCoupon)

router.get("/", getAllCoupons);

router.get("/:_id", getCouponByCodeOrId);

router.patch("/:_id", updateCoupon);

module.exports = router;