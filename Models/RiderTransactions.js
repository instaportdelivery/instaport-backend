const mongoose = require('mongoose');

const RIDER_TRANSACTIONS = new mongoose.Schema({
    amount: {
        type: Number,
        default: 0,
        required: true
    },
    timestamp: {
        type: Number,
        default: Date.now(),
        required: true
    },
    message: {
        type: String,
        required: true
    },
    rider: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "RIDER"
    },
    transactionID: {
        type: String,
        default: "",
    },
    completed: {
        type: Boolean,
        default: false
    },
    request: {
        type: Boolean,
        default: false
    },
    debit: {
        type: Boolean,
        default: true
    },
    order: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "ORDER",
    }
})
module.exports = mongoose.model("RIDER_TRANSACTIONS", RIDER_TRANSACTIONS);