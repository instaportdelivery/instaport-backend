const Order = require("../Models/Order")

//Create Order
const createOrder = async (req, res) => {
    try {
        const order = new Order({
            customer: req.customer._id,
            ...req.body
        })
        const response = await order.save();
        if (response) {
            res.json({ error: false, message: "Order Created Successfully", order: response })
        } else {
            res.json({ error: true, message: "Something Went Wrong" })
        }
    }
    catch (error) {
        res.json({ error: true, error: error.message })
    }
}

const customerOrders = async (req, res) => {
    const orders = await Order.find({ customer: req.customer._id }).sort({
        time_stamp: "desc"
    }).populate("rider");
    if (!orders) {
        res.json({ error: true, message: "Something Went Wrong", order: undefined })
    } else {
        res.json({
            error: false,
            message: "Orders Fetched Successfully!",
            order: orders,
        });
    }
}

const orderByIDCustomer = async (req, res) => {
    const order = await Order.findOne({ _id: req.params._id }).populate("customer", "-password").populate("rider", "-password");
    if (!order) {
        res.json({ error: true, message: "Something Went Wrong", order: undefined })
    } else {
        res.json({
            error: false,
            message: "Orders Fetched Successfully!",
            order: order,
        });
    }
}

const orderByIDCustomerApp = async (req, res) => {
    const order = await Order.findOne({ _id: req.params._id }).populate("rider");
    if (!order) {
        res.json({ error: true, message: "Something Went Wrong", order: undefined })
    } else {
        res.json({
            error: false,
            message: "Orders Fetched Successfully!",
            order: order,
        });
    }
}

//Update Order
const updateOrder = async (req, res) => {
    const order = await Order.findOne({ _id: req.body._id })
    if (!order) {
        res.json({ error: true, message: "Something Went Wrong", order: undefined })
    }
    else {
        try {
            const orderUpdate = await Order.findByIdAndUpdate(order._id, req.body, {
                returnOriginal: false
            })
            res.json({
                error: false,
                message: "Updated Successful!",
                order: orderUpdate,
            });
        } catch (error) {
            res.status(500).json({
                error: true,
                message: error.message,
            });
        }
    }

}

//Order Status
const statusOrder = async (req, res) => {
    const order = await Order.findOne({ _id: req.body._id })
    if (!order) {
        res.json({ error: true, message: "Something Went Wrong", order: undefined })
    }
    else {
        try {
            const orderUpdate = await Order.findByIdAndUpdate(order._id, {
                status: req.body.status,
                rider: req.body.rider
            }, {
                returnOriginal: false
            })
            res.json({
                error: false,
                message: "Status Updated Successfully!",
                order: orderUpdate,
            });
        } catch (error) {
            res.status(500).json({
                error: true,
                message: error.message,
            });
        }
    }

}

//Get All Order
const allOrders = async (req, res) => {
    const orders = await Order.find({}).populate("customer", "-password").populate("rider", "-password");
    if (!orders) {
        res.json({ error: true, message: "Something Went Wrong", order: undefined })

    } else {
        res.json({
            error: false,
            message: "Orders Fetched Successfully!",
            order: orders,
        });
    }
}

const riderOrders = async (req, res) => {
    const orders = await Order.find({ $or: [{ rider: req.rider._id }, { status: "new" }] }).populate("customer", "-password").populate("rider", "-password");
    if (!orders) {
        res.json({ error: true, message: "Something Went Wrong", order: undefined })

    } else {
        res.json({
            error: false,
            message: "Orders Fetched Successfully!",
            order: orders,
        });
    }
}

module.exports = { createOrder, updateOrder, statusOrder, allOrders, customerOrders, orderByIDCustomer, orderByIDCustomerApp, riderOrders };