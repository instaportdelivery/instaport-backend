const DeliveryStatus = require("../Models/DeliveryStatus")

const createDeliveryStatus = async (req, res) => {
	try {
		const newStatus = new DeliveryStatus(req.body);
		const savedStatus = await newStatus.save();
		return res.json({
			error: false,
			message: "Delivery Status Added",
			status: savedStatus
		})
	} catch (error) {
		return res.status(500).json({
			error: true,
			message: error.message,
		})
	}
}

const getStatusByOrder = async (req, res) => {
	try {
		const status = await DeliveryStatus.find({ order_id: req.body._id }).sort({ "timestamp": "desc" });
		return res.json({
			error: false,
			message: "Delivery Status Added",
			status: status || []
		})
	} catch (error) {
		return res.status(500).json({
			error: true,
			message: error.message,
		})
	}
}

module.exports = { createDeliveryStatus, getStatusByOrder };