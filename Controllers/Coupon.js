const Coupons = require("../Models/Coupons")

const createCoupon = async (req, res) => {
	try {
		const coupons = await Coupons.findOne({ code: req.body.code });
		if (coupons) return;
		const newCoupon = new Coupons(req.body);
		const savedCoupon = await newCoupon.save();

		if (savedCoupon) {
			return res.json({
				error: false,
				message: "Coupon created successfully!",
				coupon: savedCoupon
			})
		} else {
			return res.json({
				error: true,
				message: "Something went wrong!",
			})
		}
	} catch (error) {
		return res.json({
			error: true,
			message: error.message
		})
	}
}

const getAllCoupons = async (req, res) => {
	try {
		const coupons = await Coupons.find({});
		if (!coupons) return;
		return res.json({
			error: false,
			message: "Coupons fetched successfully!",
			coupons: coupons
		})
	} catch (error) {
		return res.json({
			error: true,
			message: error.message
		})
	}
}

const getCouponByCodeOrId = async (req, res) => {
	try {
		console.log(req.params._id)
		const coupon = await Coupons.findOne({ code: req.params._id })
		if (!coupon) return res.json({
			error: true,
			message: "Coupon not found!",
		});
		return res.json({
			error: false,
			message: "Coupon fetched successfully!",
			coupon: coupon
		})
	} catch (error) {
		return res.json({
			error: true,
			message: error.message
		})
	}
}

const updateCoupon = async (req, res) => {
	try {
		const coupon = await Coupons.findByIdAndUpdate(req.params._id, { disabled: req.body.disabled }, { returnOriginal: false });
		if (!coupon) return;
		return res.json({
			error: false,
			message: "Coupon updated successfully!",
			coupons: coupon
		})
	} catch (error) {
		return res.json({
			error: true,
			message: error.message
		})
	}
}

module.exports = {
	createCoupon,
	getAllCoupons,
	getCouponByCodeOrId,
	updateCoupon
}