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
    try {
        const rider = await Rider.findById(req.rider._id);
        let orders = [];
        if (rider.wallet_amount >= 0) {
            orders = await Order.find({ $or: [{ rider: req.rider._id }, { status: "new" }] }).populate("customer", "-password").populate("rider", "-password");
        } else {
            orders = await Order.find({ $and: [{ $or: [{ rider: req.rider._id }, { status: "new" }] }, { payment_method: { $ne: "cod" } }] }).populate("customer", "-password").populate("rider", "-password");
        }
        res.json({
            error: false,
            message: "Orders Fetched Successfully!",
            order: orders,
        });
    } catch (error) {

    }
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
        }).populate("rider").populate("customer");
        const rider = await Rider.findByIdAndUpdate(order.rider, {
            $pull: {
                orders: order._id
            },
            $inc: {
                wallet_amount: order.payment_method === "cod" ? - order.amount * (order.commission / 100) : order.amount * ((100 - order.commission) / 100)
            }
        })
        const transaction = new RiderTransactions({
            amount: order.payment_method === "cod" ? order.amount * (order.commission / 100) : order.amount * ((100 - order.commission) / 100),
            debit: order.payment_method === "cod" ? true : false,
            message: `Completed order`,
            rider: rider._id,
            request: false,
            completed: true,
            order: order._id
        })
        const savedTransactions = await transaction.save();
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

const withdrawOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params._id).populate("rider").populate("customer");
        if (!order) {
            return res.status(200).json({
                error: true,
                message: "Order not found",
                order: order
            })
        } else {
            const rider = await Rider.findByIdAndUpdate(order.rider._id, {
                $pull: {
                    orders: order._id
                },
                $inc: {
                    wallet_amount: -40
                }
            })
            const withdrawalOrder = await Order.findByIdAndUpdate(order._id, {
                status: "new",
                orderStatus: [],
                rider: null
            }, {
                returnOriginal: false
            });
            const transaction = new RiderTransactions({
                amount: 40,
                debit: true,
                message: `Order Withdraw`,
                rider: rider._id,
                request: false,
                completed: true,
                order: order._id
            })
            return res.status(200).json({
                error: false,
                message: "Order withdrawal successful",
                order: withdrawalOrder
            })
        }
    } catch (error) {
        res.status(500).json({
            error: false,
            message: error.message,
        })
    }
}



module.exports = { createOrder, updateOrder, statusOrder, allOrders, customerOrders, orderByIDCustomer, orderByIDCustomerApp, riderOrders, completedOrder, withdrawOrder };