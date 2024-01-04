const jwt = require("jsonwebtoken");

const AdminRiderToken = (req, res, next) => {
    try {
        let token = req?.headers?.authorization?.split(" ")[1];
        const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (data && data.role == "rider"||data.role=="admin") {
            const AdminRiderId = {
                _id: data._id
            }
            req["adminrider"] = AdminRiderId
            next();
        } else {
            return res.json({ error: true, message: "Unauthorized access" });
        }

    } catch (err) {
        return res.json({ error: true, message: err.message })
    }

}
module.exports = { AdminRiderToken };