const mongoose = require('mongoose');

let productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    product_url: {
        type: String,
        required: true
    }, createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'product'
    }, exhibitionid: {
        type: mongoose.Schema.ObjectId,
        ref: 'exhibition'
    }
})

let ProductModel = mongoose.model('ProductModel', productSchema);
module.exports = ProductModel;