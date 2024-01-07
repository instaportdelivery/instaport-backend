const Rider = require("../Models/Rider")
const Order = require("../Models/Order")
const bcrypt = require('bcrypt');
const jwtToken = require('jsonwebtoken')


const riderSignup = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hassPassword = await bcrypt.hash(req.body.password, salt);
        const rider = new Rider({
            ...req.body, password: hassPassword,
        })
        const response = await rider.save();
        if (response) {
            res.json({ error: false, message: "Account Created Successfully" })

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
        if (check.rider != undefined) return res.json({ error: true, message: "Already Assigned", order: check })
        const OrderUpdate = await Order.findByIdAndUpdate(req.params._id, { rider: req.rider._id, status: "processing" }, {
            returnOriginal: false
        })
        res.json({
            error: false,
            message: "Updated Successful!",
            order: OrderUpdate
        });
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

module.exports = { riderSignup, riderSignin, riderUpdate, riderData, riderStatus, allRiders, deleteRider, orderAssign }