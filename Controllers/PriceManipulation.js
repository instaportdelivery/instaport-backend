const PriceManipulation = require("../Models/PriceManipulation");

//Create Price
const priceManipulation = async (req, res) => {
    try {
        const priceManipulation = new PriceManipulation({
            ...req.body
        })
        const response = await priceManipulation.save();
        if (response) {
            res.json({ error: false, message: "Price Added Successfully", priceManipulation: response })
        } else {
            res.json({ error: true, message: "Something Went Wrong" })
        }
    }
    catch (error) {
        res.json({ error: true, error: error.message })
    }
}

//Update Price
const updatePriceManipulation = async (req, res) => {
    const priceManipulation = await PriceManipulation.findOne({ _id: req.body._id })
    if (!priceManipulation) {
        res.json({ error: true, message: "Something Went Wrong", priceManipulation: undefined })
    }
    else {
        try {
            const priceManipulationUpdate = await PriceManipulation.findByIdAndUpdate(priceManipulation._id, req.body, {
                returnOriginal: false
            })
            res.json({
                error: false,
                message: "Updated Successful!",
                priceManipulation: priceManipulationUpdate,
            });
        } catch (error) {
            res.status(500).json({
                error: true,
                message: error.message,
            });
        }
    }

}


//get price
const getPriceManipulation = async (req, res) => {
    try {
        const response = await PriceManipulation.findOne();
        if (response) {
            res.json({ error: false, message: "Price Fetch Successfully", priceManipulation: response });

        } else {
            res.json({ error: true, message: "Something Went Wrong", priceManipulation: undefined })

        }
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }
}

module.exports = { priceManipulation, updatePriceManipulation, getPriceManipulation }
