const { Mongoose, Schema, default: mongoose } = require("mongoose");


const USER_SCHEMA = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    mobileno: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    city: {
        type: mongoose.SchemaTypes.ObjectID,
        ref: "CITY",
    },
    usecase: {
        type: String,
        required: true,
        enum: ["individual", "business"]
    },
    verified: {
        type: Boolean,
        default: false,
        required: true
    },
    token: {
        type: String
    },
    role: {
        type: String,
        required: true,
        default: "customer"
    },
    wallet: {
        type: Number,
        required: true,
        default: 0
    },
    holdAmount:{
        type: Number,
        default: 0,
        required: true,
    }
}, { timestamps: true })


module.exports = mongoose.model("USER", USER_SCHEMA);