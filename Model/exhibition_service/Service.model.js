const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: [true, 'we need this field']
    },
    service_name: {
        type: String,
        enum: [
            "Printing",
            "Furniture Rental",
            "LED / TV Rental",
            "Fabrication",
            "Protocol Staff",
            "Catalog Printing",
            "Corporate Gifting"
        ],
        required: true
    },
    country: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    mobile_number: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema);
