const { default: mongoose } = require('mongoose');
const Mongoose = require('mongoose');

const ADMIN_SCHEMA = new Mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        reequire: true,
        default: "admin"
    }
})
module.exports = mongoose.model("ADMIN", ADMIN_SCHEMA);