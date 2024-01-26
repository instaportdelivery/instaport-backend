const Rider = require("../Models/Rider")
const Order = require("../Models/Order")
const bcrypt = require('bcrypt');
const jwtToken = require('jsonwebtoken');
const RiderTransactions = require("../Models/RiderTransactions");


const riderSignup = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hassPassword = await bcrypt.hash(req.body.password, salt);
        const rider = new Rider({
            ...req.body, password: hassPassword,
        })
        const response = await rider.save();
        if (response) {
            const token = jwtToken.sign({ _id: response._id, role: response.role }, process.env.ACCESS_TOKEN_SECRET);
            res.json({ error: false, message: "Account Created Successfully", token: token })
        } else {
            res.json({ error: true, message: "Something Went Wrong" })

        }
    } catch (err) {
        res.json({ error: true, error: err.message })
    }
}

const riderSignin = async (req, res) => {
    const rider = await Rider.findOne({ mobileno: req.body.mobileno });
    if (!rider) {
        res.json({ error: true, message: "Something Went Wrong", rider: undefined })
    } else {
        try {
            if (await bcrypt.compare(req.body.password, rider.password)) {
                const token = jwtToken.sign({ _id: rider._id, role: rider.role }, process.env.ACCESS_TOKEN_SECRET);
                res.json({ error: false, message: "Logged In Successfully", token: token })
            } else {
                res.json({ error: true, message: "Invalid Credentials", token: undefined })
            }
        } catch (error) {
            res.json({ error: true, message: error.message, token: undefined })
        }

    }
}
const riderUpdate = async (req, res) => {
    const rider = await Rider.findOne({ _id: req.rider._id });
    if (!rider) res.json({ error: true, message: "Something Went Wrong", rider: undefined })
    else {
        try {
            const riderUpdate = await Rider.findByIdAndUpdate(rider._id, req.body, {
                returnOriginal: false
            })
            console.log(riderUpdate, req.body)
            res.json({
                error: false,
                message: "Updated Successful!",
                rider: riderUpdate,
            });
        } catch (error) {
            res.status(500).json({
                error: true,
                message: error.message,
            });
        }
    }
}
const orderAssign = async (req, res) => {
    try {
        const check = await Order.findOne({ _id: req.params._id });
        const checkRider = await Rider.findOne({ _id: req.rider._id });
        console.log(check.status != "new" || checkRider.orders.length >= 2, check.status, checkRider.orders.length)
        if (check.status != "new" || checkRider.orders.length >= 2) {
            return res.json({ error: true, message: "Cannot Assign", rider: checkRider })
        } else {
            const OrderUpdate = await Order.findByIdAndUpdate(req.params._id, { rider: req.rider._id, status: "processing" }, {
                returnOriginal: false
            })
            const RiderUpdate = await Rider.findByIdAndUpdate(req.rider._id, { $push: { orders: check._id } }, {
                returnOriginal: false
            })
            res.json({
                error: false,
                message: "Updated Successful!",
                rider: RiderUpdate
            });
        }
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }
}
const riderData = async (req, res) => {
    const rider = await Rider.findOne({ _id: req.rider._id }, { password: 0 });
    if (!rider) res.json({ error: true, message: "Something Went Wrong", rider: undefined })
    else {
        try {
            res.json({
                error: false,
                message: "Fetched Successful!",
                rider: rider,
            });
        } catch (error) {
            res.json({
                error: true,
                message: error.message,
            });
        }
    }
}
const riderStatus = async (req, res) => {
    const rider = await Rider.findOne({ _id: req.body._id })
    if (!rider) res.json({ error: true, message: "Something Went Wrong", rider: undefined })
    else {
        try {
            const riderStatus = await Rider.findByIdAndUpdate(rider._id, {
                ...req.body
            }, { returnOriginal: false })
            res.json({
                error: false,
                message: "Updated Successful!",
                rider: riderStatus,
            });
        } catch (error) {
            res.status(500).json({
                error: true,
                message: error.message,
            });
        }
    }
}

//Get All Rider
const allRiders = async (req, res) => {
    const riders = await Rider.find({}, { password: 0 });
    if (!riders) {
        res.json({ error: true, message: "Something Went Wrong", rider: undefined })

    } else {
        res.json({
            error: false,
            message: "riders Fetched Successfully!",
            rider: riders,
        });
    }

}

const deleteRider = async (req, res) => {
    const riders = await Rider.findByIdAndDelete(req.params._id);
    res.json({
        error: false,
        message: "Rider Deleted Successfully!",
        rider: riders,
    });
}




const getRiderTransactions = async (req, res) => {
    try {
        const transactions = await RiderTransactions.find({ rider: req.rider._id }).populate("rider").populate("order").populate({
            path: "order",
            populate: {
                path: "rider",
                model: "RIDER"
            }
        }).populate({
            path: "order",
            populate: {
                path: "customer",
                model: "USER"
            }
        });
        res.status(200).json({
            error: false,
            message: "Transactions fetched Successfully!",
            transactions: transactions,
        });
    } catch (error) {
        res.status(500).json({
            error: false,
            message: error.message,
        });
    }
}

const requestAmount = async (req, res) => {
    try {
        const rider = await Rider.findById(req.rider._id);
        if (rider.requestedAmount != 0) {
            return res.status(200).json({
                error: true,
                message: "Request already in process",
                rider: rider
            });
        } else if (rider.wallet_amount < 100) {
            return res.status(200).json({
                error: true,
                message: "Minimum account balance should be Rs.100",
                rider: rider
            });
        } else if (rider.wallet_amount < 150) {
            return res.status(200).json({
                error: true,
                message: "Minimum request amount is Rs. 50",
                rider: rider
            });
        } else {
            const riderWallet = await Rider.findByIdAndUpdate(rider._id, {
                wallet_amount: 100,
                requestedAmount: rider.wallet_amount - 100
            }, {
                returnOriginal: false
            })
            const riderTransaction = new RiderTransactions({
                amount: rider.wallet_amount - 100,
                completed: false,
                request: true,
                message: "Request",
                rider: rider._id,
                debit: true
            })
            const savedTransaction = await riderTransaction.save();
            return res.status(200).json({
                error: false,
                message: "Request Successfull",
                rider: riderWallet
            });
        }
    } catch (error) {
        res.status(500).json({
            error: false,
            message: error.message,
        });
    }
}

const confirmPayAdmin = async (req, res) => {
    try {
        const transaction = await RiderTransactions.findByIdAndUpdate(req.params._id, {
            tratransactionID: req.body.transactionID,
            completed: true
        }, {
            returnOriginal: false
        })
        const rider = await Rider.findByIdAndUpdate(transaction.rider, {
            requestedAmount: 0
        })
        return res.status(200).json({
            error: false,
            message: "Successfull",
            transaction: transaction
        });
    } catch (error) {
        res.status(500).json({
            error: false,
            message: error.message,
        });
    }
}

module.exports = { riderSignup, riderSignin, riderUpdate, riderData, riderStatus, allRiders, deleteRider, orderAssign, getRiderTransactions, requestAmountm, confirmPayAdmin}