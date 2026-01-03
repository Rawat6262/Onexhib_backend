let mongoose = require('mongoose');
let productSchema = new mongoose.Schema({
    product_name:
        { type: String, required: true },
    category: { type: String, required: true },
    details: { type: String, required: true }, 
    price: { type: Number,  },
     product_url: { type: String, },
      createdBy: { type: mongoose.Schema.ObjectId, ref: 'product' },
       exhibitionid: { type: mongoose.Schema.ObjectId, ref: 'exhibition' },
        product_video_url: { type: String, }
})
let ProductModel = mongoose.model('ProductModel', productSchema); module.exports = ProductModel;   