let mongoose = require('mongoose');
let newschema = new mongoose.Schema({
    news_title: {
        type: String,
        required: true
    }, news_description: {
        type: String,
        required: true
    }, news_url: {
        type: String,
    }, news_image_url: {
        type: String,
        required: true
    }, createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'exhibitionModel'
    }, new_category: {
        type: String,
        required: true
    }
})
let newsModel = mongoose.model('newsModel', newschema);

module.exports = newsModel;