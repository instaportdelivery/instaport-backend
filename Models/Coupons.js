const mongoose = require("mongoose");

const CouponsSchema = new mongoose.Schema({
	code: {
		type: String,
		required: true,
		unique: true,
		uppercase: true
	},
	timestamp: {
		type: Number,
		default: Date.now(),
		required: true
	},
	disabled: {
		type: Boolean,
		required: true,
		default: false
	},
	percentOff: {
		type: Number,
		required: true,
		default: 0
	},
	maxAmount: {
		type: Number,
		required: true,
		default: 0
	},
	minimumCartValue: {
		type: Number,
		default: 0,
		required: true
	}
}, {
	timestamps: true
});


module.exports = mongoose.model("coupon", CouponsSchema);