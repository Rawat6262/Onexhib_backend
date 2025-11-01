let mongoose = require('mongoose');
let otpschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    }, email: {
        type: String,
        required: true
    }, mobile_number: {
        type: Number,
        required: true
    }, otp: {
        type: Number,
        required: true
    }, isapproved: {
        type: Boolean,
        required: true,
        default: false,
        // set: () => true // Always force true
    }
})

let otpmodel = mongoose.model('otpmodel',otpschema);

module.exports= otpmodel;