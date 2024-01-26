const express = require("express");
const { createOrder, updateOrder, statusOrder, allOrders, customerOrders, orderByIDCustomer, orderByIDCustomerApp, riderOrders, completedOrder, withdrawOrder } = require("../Controllers/Order");
const router = express.Router();
const { AdminCustomerToken } = require("../Middlewares/AdminCustomerAuth")
const { RiderToken } = require("../Middlewares/RiderAuth")
const { CustomerToken } = require("../Middlewares/CustomerAuth");

router.get("/orders", allOrders);

router.get("/riders", RiderToken, riderOrders);

router.get("/customer/orders", CustomerToken, customerOrders)

router.get("/customer/:_id", orderByIDCustomer)

router.get("/customer_app/:_id", orderByIDCustomerApp)

router.post("/create", CustomerToken, createOrder)

router.patch("/update", AdminCustomerToken, updateOrder)

router.patch("/orderstatus/:_id", RiderToken, statusOrder)

router.patch("/completed/:_id", RiderToken, completedOrder)

router.patch("/withdraw/:_id", RiderToken, withdrawOrder)




module.exports = router;