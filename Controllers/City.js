const City = require("../Models/City");
const createCity = async (req, res) => {
    try {
        const city = new City({
           ...req.body
        })
        const response = await city.save();
        if (response) {
            res.json({ error: false, message: "City Added Successfully", city: response });

        } else {
            res.json({ error: true, message: "Something Went Wrong", city: undefined })

        }
    } catch (err) {
        res.json({ error: true, error: err.message, city: undefined })
    }
}

const getCity = async (req, res) => {
    try {
        const response = await City.find();
        if (response) {
            res.json({ error: false, message: "City Fetch Successfully", city: response });

        } else {
            res.json({ error: true, message: "Something Went Wrong", city: undefined })

        }
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
            city: undefined,
        });
    }
}
module.exports = { createCity, getCity };