const mongoose = require("mongoose");

const CustomerTransactionSchema = new mongoose.Schema({
	amount: {
		type: Number,
		required: true
	},
	customer: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: "USER",
		required: true,
	},
	timestamp: {
		type: Number,
		required: true,
		default: Date.now(),
	},
	status: {
		type: String,
		required: true,
	},
	payment_method_type: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
	debit: {
		type: Boolean,
		required: true,
	},
	wallet: {
		type: Boolean,
		required: true
	}
}, { timestamps: true });

module.exports = mongoose.model("customer-transactions", CustomerTransactionSchema);