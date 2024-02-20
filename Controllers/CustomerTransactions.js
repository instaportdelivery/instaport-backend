const CustomerTransaction = require("../Models/CustomerTransaction");
const User = require("../Models/User");
const Order = require("../Models/Order");
const jwt = require("jsonwebtoken");


const walletTopUp = async (req, res) => {
	try {
		const transactionData = await jwt.verify(req.body.transaction_response, "31MhbX6UsCr7io5GJltm7kXsbbnxs7KO")
		const updatedCustomer = await User.findByIdAndUpdate(transactionData.additional_info.additional_info1, {
			$inc: {
				wallet: Number(transactionData.amount)
			}
		}, { returnOriginal: false })
		if (!updatedCustomer) return
		const transaction = new CustomerTransaction({ customer: transactionData.additional_info.additional_info1, payment_method_type: transactionData.payment_method_type, status: transactionData.transaction_error_type, amount: Number(transactionData.amount), type: "topup", wallet: true, debit: false });
		const newTransaction = await transaction.save();
		if (newTransaction) {
			return res.redirect("https://instaport-transactions.vercel.app/success.html");
		} else {
			return res.json({
				error: true,
				message: "Something went wrong",
			});
		}
	} catch (error) {
		console.log(error);
		return res.json({
			error: true,
			message: error.message,
		});
	}
}

const createOrderTransaction = async (req, res) => {
	try {
		const transactionData = await jwt.verify(req.body.transaction, "31MhbX6UsCr7io5GJltm7kXsbbnxs7KO")
		const transaction = new CustomerTransaction({ customer: req.customer._id, payment_method_type: transactionData.payment_method_type, status: transactionData.transaction_error_type, amount: Number(transactionData.amount), type: "payment", wallet: false, debit: true });
		const newTransaction = await transaction.save();
		if (newTransaction) {
			return res.json({
				error: false,
				message: "payment successful!",
				transaction: newTransaction
			});
		} else {
			return res.json({
				error: true,
				message: "Something went wrong",
			});
		}
	} catch (error) {
		return res.json({
			error: true,
			message: error.message,
		});
	}
}

const createWalletOrderTransaction = async (req, res) => {
	try {
		const order = new Order({
			customer: req.customer._id,
			...req.body
		})
		const response = await order.save();
		const customer = await User.findById(req.customer._id);
		if (customer.holdAmount != 0 && customer.holdAmount < Number(req.body.amount)) {
			const transaction = new CustomerTransaction({ customer: req.customer._id, payment_method_type: "wallet", status: "success", amount: Number(req.body.amount), type: "payment", wallet: true, debit: true });
			const newTransaction = await transaction.save();
			const updatedCustomer = await User.findByIdAndUpdate(req.customer._id, {
				$inc: {
					wallet: - (Number(newTransaction.amount) - customer.holdAmount)
				},
				holdAmount: 0,
			}, { returnOriginal: false })
		} else if (customer.holdAmount != 0 && customer.holdAmount > Number(req.body.amount)) {
			const transaction = new CustomerTransaction({ customer: req.customer._id, payment_method_type: "hold", status: "success", amount: Number(req.body.amount), type: "payment", wallet: true, debit: true });
			const newTransaction = await transaction.save();
			const updatedCustomer = await User.findByIdAndUpdate(req.customer._id, {
				$inc: {
					holdAmount: - Number(newTransaction.amount)
				}
			}, { returnOriginal: false })
		}
		return res.json({
			error: false,
			message: "payment successful!",
			order: response
		});
	} catch (error) {
	return res.json({
		error: true,
		message: error.message,
	});
}
}

const CustomerTransactions = async (req, res) => {
	try {
		const transactions = await CustomerTransaction.find({ customer: req.customer._id }).sort({ "timestamp": "desc" });
		if (transactions) {
			return res.json({
				error: false,
				message: "Fetched successfully!",
				transactions: transactions
			});
		} else {
			return res.json({
				error: true,
				message: "Something went wrong",
			});
		}
	} catch (error) {
		return res.json({
			error: true,
			message: error.message,
		});
	}
}

module.exports = { walletTopUp, CustomerTransactions, createOrderTransaction, createWalletOrderTransaction }