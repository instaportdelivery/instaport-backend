const mongoose = require('mongoose');

const DELIVERY_STATUS_SCHEMA = new mongoose.Schema({
    order_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "ORDER",
        required: true
    },
    timestamp: {
        type: Number,
        default: Date.now(),
        required: true
    },
    message:{
        type: String,
        required: true
    },
    rider: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "RIDER"
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "USER"
    }
})
module.exports = mongoose.model("DELIVERY_STATUS", DELIVERY_STATUS_SCHEMA);