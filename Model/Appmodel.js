let  mongoose = require('mongoose');
let  appschema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    }, pass: {
        type: String,
        required: true
    }, email: {
        type: String,
        required: true,
        unique:true
    }, mobile_number: {
        type: Number,
        required: true
    },isapproved:{
        type:Boolean,
        require:true,
        default:false
    }
})
let appmodel = mongoose.model('appmodel',appschema);

module.exports = appmodel;