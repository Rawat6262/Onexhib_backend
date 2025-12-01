let mongoose = require('mongoose');

let exhibitionschema = new mongoose.Schema(
  {
    exhibition_name: {
      type: String,
      required: true,
      trim: true
    },
    addedBy: {
      type: String,
      required: true,
      trim: true
    },
    exhibition_address: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    venue: {
      type: String,
      required: true,
      trim: true
    },
    starting_date: {
      type: Date, // Changed from Number to Date for optimized date handling
      required: true
    },
    ending_date: {
      type: Date, // Changed from Number to Date for optimized date handling
      required: true
    },
    email:{
 type: String,
      required: true,
      trim: true
    },
    createdby: {
      type: mongoose.Schema.ObjectId,
      ref: 'user'
    }, exhibtion_url: {
      type: String,
      required: true
    },
    about_exhibition: {
      type: String,
      required: true
    }, layout_url: {
      type: String,
      required: true
    },
    speakers: {
      type: String,
      required: true,
    },
    session: {
      type: String,
      required: true,
    },
    sponsor: {
      type: String,
      required: true,
    },
    privacy_policy: {
      type: String,
      required: true,
    },
    partners: {
      type: String,
      required: true,
    }, terms_of_service: {
      type: String,
      required: true,
    },
    Support: {
      type: String,
      required: true,
    }

  },
  {
    timestamps: true // Adds createdAt and updatedAt fields automatically
  }
);

let exhibitionModel = mongoose.model('exhibitionModel', exhibitionschema);

module.exports = exhibitionModel;
