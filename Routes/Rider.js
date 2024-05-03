const express = require("express");
const { riderSignup, riderSignin, riderUpdate, riderStatus, riderData, allRiders, deleteRider, orderAssign, getRiderTransactions, requestAmount, confirmPayAdmin, adminTransaction, reAssign, payDues, riderUpdatePassword, getRiderValidity } = require("../Controllers/Rider");
const router = express.Router();
const { RiderToken } = require("../Middlewares/RiderAuth");
const { AdminToken } = require("../Middlewares/AdminAuth");

router.post("/signup", riderSignup);
router.post("/signin", riderSignin);
router.get("/riders", allRiders);
router.patch("/update", RiderToken, riderUpdate);
router.patch("/update-password", riderUpdatePassword);
router.post("/get-validity", getRiderValidity);
router.patch("/assign/:_id", RiderToken, orderAssign);
router.get("/", RiderToken, riderData)
router.patch("/riderstatus", AdminToken, riderStatus)
router.delete("/delete/:_id", AdminToken, deleteRider)

router.get("/transactions", RiderToken, getRiderTransactions);
router.post("/request-money", RiderToken, requestAmount);

router.patch("/pay/:_id", AdminToken, confirmPayAdmin);
router.get("/admin/transactions", AdminToken, adminTransaction);

router.post("/app-payment/", payDues)

router.patch("/admin/reassign/:_id", AdminToken, reAssign);
module.exports = router;
