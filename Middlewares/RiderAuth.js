const jwt = require("jsonwebtoken");

const RiderToken = (req, res, next) => {
    try {
        let token = req?.headers?.authorization?.split(" ")[1];
        const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (data && data.role == "rider") {
            const riderid = {
                _id: data._id
            }
            req["rider"] = riderid
            next();
        } else {
            return res.json({ error: true, message: "Unauthorized access" });
        }

    } catch (err) {
        return res.json({ error: true, message: err.message })
    }

}
module.exports = { RiderToken };