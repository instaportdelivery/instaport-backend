const Admin = require("../Models/Admin");
const bcrypt = require('bcrypt');
const jwtToken = require('jsonwebtoken')


const adminSignup = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hassPassword = await bcrypt.hash(req.body.password, salt);
        const admin = new Admin({
            ...req.body, password: hassPassword,
        })
        const response = await admin.save();
        if (response) {
            res.json({ error: false, message: "Account Create Successfully", response: response })

        } else {
            res.json({ error: true, message: "Something Went Wrong", response: response })

        }
    } catch (err) {
        res.json({ error: true, error: err.message, response: undefined })
    }
}
const adminSignin = async (req, res) => {
    const admin = await Admin.findOne({ username: req.body.username });
    if (!admin) {
        res.json({ error: true, message: "Something Went Wrong", admin: undefined })
    } else {
        try {
            if (await bcrypt.compare(req.body.password, admin.password)) {
                const token = jwtToken.sign({ _id: admin._id, role: admin.role }, process.env.ACCESS_TOKEN_SECRET);
                res.json({ error: false, message: "Logged In Successfully", token: token })
            } else {
                res.json({ error: true, message: "Invalid Credentials", token: undefined })
            }
        } catch (error) {
            res.json({ error: true, message: error.message, token: undefined })
        }

    }
}

module.exports = { adminSignup, adminSignin };
