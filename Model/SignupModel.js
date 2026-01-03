let mongoose = require('mongoose');

let Signupschema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobile_number: {
        type: Number,
        required: true,
        unique: true
    },
    designation: {
        type: String,
        // required: true
    },
    company_name: {
        type: String,
        // required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    website: {
        type: String,
        // required: true
    },
    country: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'NORMAL'
    },otp:{
        type:Number,
        required:true
    },
    isapproved: {
        type: Boolean,
        required: true,
        default: false,
        // set: () => true // Always force true
    }
});

// Force isapproved to true before saving (extra safety)
// Signupschema.pre('save', function (next) {
//     this.isapproved = true;
//     next();
// });

let Signupmodel = mongoose.model('Signupmodel', Signupschema);
module.exports = Signupmodel;
 