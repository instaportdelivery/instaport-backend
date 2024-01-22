const Order = require("../Models/Order");
const RiderTransactions = require("../Models/RiderTransactions");
const Rider = require("../Models/Rider");

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
    const order = await Order.findOne({ _id: req.params._id }).populate("customer").populate("rider")
    console.log(req.body);
    if (!order) {
        res.status(500).json({ error: true, message: "Something Went Wrong", order: undefined })
    }
    else {
        try {
            const orderUpdate = await Order.findByIdAndUpdate(order._id, {
                orderStatus: req.body.orderStatus,
                status: "processing"
            }, {
                returnOriginal: false
            }).populate("customer").populate("rider")
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
    res.json({
        error: false,
        message: "Orders Fetched Successfully!",
        order: orders,
    });
}

const completedOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params._id, {
            status: "delivered",
            $push: {
                orderStatus: {
                    timestamp: Date.now(),
                    message: "Delivered"
                }
            }
        }, {
            returnOriginal: false
        });
        const rider = await Rider.findByIdAndUpdate(order.rider, {
            $pull: {
                orders: order._id
            },
            $inc: {
                wallet_amount: order.payment_method === "cod" ? - order.amount * (order.commission / 100) : order.amount * ((100 - order.commission) / 100)
            }
        })
        res.status(200).json({
            error: false,
            message: "Order Completed Successfully",
            order: order
        })
    } catch (error) {
        res.status(500).json({
            error: false,
            message: error.message,
        })
    }
}



module.exports = { createOrder, updateOrder, statusOrder, allOrders, customerOrders, orderByIDCustomer, orderByIDCustomerApp, riderOrders, completedOrder };