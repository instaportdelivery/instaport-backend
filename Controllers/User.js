const User = require("../Models/User");
const bcrypt = require('bcrypt');
const jwtToken = require('jsonwebtoken');
const Rider = require("../Models/Rider");

const userSignup = async (req, res) => {
    try {
        const rider = await Rider.findOne({ mobileno: req.body.mobileno });
        if (!rider) {
            const salt = await bcrypt.genSalt(10);
            const hassPassword = await bcrypt.hash(req.body.password, salt);
            const user = new User({
                ...req.body, password: hassPassword,
            })
            const response = await user.save();
            if (response) {
                res.json({ error: false, message: "Account Created Successfully" })

            } else {
                res.json({ error: true, message: "Something Went Wrong" })

            }
        }else {
            res.status(403).json({ error: true, message: "Cannot signup with this mobile number" })

        }
    } catch (err) {
        res.json({ error: true, error: err.message })
    }
}

const userSignin = async (req, res) => {
    const user = await User.findOne({ mobileno: req.body.mobileno });
    if (!user) {
        res.json({ error: true, message: "Something Went Wrong", token: "" })
    } else {
        try {
            if (await bcrypt.compare(req.body.password, user.password)) {
                const token = jwtToken.sign({ _id: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET);
                user.token = token;
                user.fcmtoken = req.body.fcmtoken;
                user.save();
                res.json({ error: false, message: "Logged In Successfully", token: token })
            } else {
                res.json({ error: true, message: "Invalid Credentials", token: "" })
            }
        } catch (error) {
            res.json({ error: true, message: error.message, token: "" })
        }

    }
}

const userUpdate = async (req, res) => {
    const user = await User.findOne({ _id: req.customer._id });
    if (!user) res.json({ error: true, message: "Something Went Wrong", user: undefined })
    else {
        try {
            const userUpdate = await User.findByIdAndUpdate(user._id, req.body, {
                returnOriginal: false
            })
            res.json({
                error: false,
                message: "Updated Successful!",
                user: userUpdate,
            });
        } catch (error) {
            res.status(500).json({
                error: true,
                message: error.message,
            });
        }
    }
}

const userData = async (req, res) => {
    const user = await User.findOne({ _id: req.customer._id }, { password: 0 });
    if (!user) {
        res.json({ error: true, message: "Something Went Wrong", user: undefined })
    }
    else {
        try {
            res.json({
                error: false,
                message: "Fetched Successful!",
                user: user,
            });
        } catch (error) {
            res.status(500).json({
                error: true,
                message: error.message,
            });
        }
    }
}

const allUsers = async (req, res) => {
    const users = await User.find({}, { password: 0 });
    if (!users) {
        res.json({ error: true, message: "Something Went Wrong", user: undefined })

    } else {
        res.json({
            error: false,
            message: "users Fetched Successfully!",
            user: users,
        });
    }

}


module.exports = { userSignup, userSignin, userUpdate, userData, allUsers };
