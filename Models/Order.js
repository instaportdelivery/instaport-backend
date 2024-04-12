const mongoose = require("mongoose");

const ORDER_SCHEMA = new mongoose.Schema({
    pickup: {
        type: Map,
        required: true
    },
    drop: {
        type: Map,
        required: true
    },
    droplocations: {
        type: [Map],
    },
    delivery_type: {
        type: String,
        default: "now",
        enum: ['scheduled', 'now'],
        required: true,
    },
    parcel_weight: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    notify_sms: {
        type: Boolean,
        default: false,
        required: true
    },
    courier_bag: {
        type: Boolean,
        default: false,
        required: true
    },
    vehicle: {
        type: String,
        required: true,
        default: "scooty",
        enum: ['scooty', 'bike']
    },
    status: {
        type: String,
        required: true,
        enum: ['delivered', 'processing', 'cancelled', "new"]
    },
    payment_method: {
        type: String,
        default: 'cod',
        required: true
    },
    payment_address: {
        type: Map,
    },
    pastRiders: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "RIDER"
    },
    rider: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "RIDER"
    },
    customer: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "USER",
        required: true
    },
    package: {
        type: String,
        required: true
    },
    time_stamp: {
        type: Number,
        default: Date.now()
    },
    parcel_value: {
        type: Number,
        default: 0,
    },
    image: {
        type: String
    },
    amount: {
        type: Number,
        required: true
    },
    discountCoupon: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "coupons"
    },
    orderStatus: {
        type: [Map],
        default: [],
    },
    commission: {
        type: Number,
        default: 20,
        required: true
    },
    prices: [Number],
    reason: {
        type: String,
        default: "",
    },
    timer: {
        type: Number,
        required: true,
        default: Date.now(),
    }
}, { timestamps: true })

module.exports = mongoose.model("ORDER", ORDER_SCHEMA);