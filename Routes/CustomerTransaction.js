const express = require("express");
const { CustomerToken } = require("../Middlewares/CustomerAuth");
const { walletTopUp, CustomerTransactions, createOrderTransaction, createWalletOrderTransaction, createOrderTransactionApp } = require("../Controllers/CustomerTransactions");
const router = express.Router();

router.post("/wallet-topup", walletTopUp)
router.post("/create-payment", CustomerToken, createOrderTransaction)
router.post("/app-create-payment/:_id", CustomerToken, createOrderTransactionApp)
// router.post("/wallet-topup", CustomerToken, walletTopUp)
router.post("/wallet-order-payment/", CustomerToken, createWalletOrderTransaction)
router.get("/get", CustomerToken, CustomerTransactions)

module.exports = router;