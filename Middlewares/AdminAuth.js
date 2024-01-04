const jwt = require("jsonwebtoken");

const AdminToken = (req, res, next) => {
    try {
        let token = req?.headers?.authorization?.split(" ")[1];
        const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (data && data.role == "admin") {
            const adminid = {
                _id: data._id
            }
            req["admin"] = adminid
            next();
        } else {
            return res.json({ error: true, message: "Unauthorized access" });
        }

    } catch (err) {
        return res.json({ error: true, message: err.message })
    }

}
module.exports = { AdminToken };