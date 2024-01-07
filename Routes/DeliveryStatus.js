const express = require("express");
const router = express.Router();
const { getStatusByOrder, createDeliveryStatus } = require("../Controllers/DeliveryStatus");


router.post("/create", createDeliveryStatus)

router.get("/:_id", getStatusByOrder)

module.exports = router;