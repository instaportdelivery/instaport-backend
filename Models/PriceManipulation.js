const { Mongoose, Schema, default: mongoose, model } = require("mongoose");

const PRICE_MANIPULATION_SCEHMA = new Schema({
    per_kilometer_charge: {
        type: Number,
        required: true
    },
    additional_per_kilometer_charge: {
        type: Number,
        required: true
    },
    additional_pickup_charge: {
        type: Number,
        required: true
    },
    security_fees_charges: {
        type: Number,
        required: true
    },
    base_order_charges:{
        type:Number,
        required:true
    },
    instaport_commission:{
        type:Number,
        required:true
    },
    additional_drop_charge:{
        type:Number,
        required:true
    }
})

module.exports=mongoose.model("PRICE_MANIPULATION",PRICE_MANIPULATION_SCEHMA)