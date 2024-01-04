const mongoose = require('mongoose');
const { Schema } = mongoose;


const CITY_SCHEMA = new Schema({
    cityName: {
        type: String,
        required: true
    },
    slug:{
        type:String,
        required:true,
        unique:true
    }
}, { timestamps: true })

module.exports = mongoose.model("CITY", CITY_SCHEMA);