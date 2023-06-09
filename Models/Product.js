const mongoose = require("mongoose");

const Productschema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
    },

    img: {
      type: [String], // Using square brackets to specify an array of strings
      required: true,
    },

    categories: {
      type: Array,
    },

    size: {
      type: Array,
    },

    color: {
      type: Array,
    },

    price: {
      type: Number,
      required: true,
    },

    inStock: {
      type: Boolean,
      required: true,
    },
  },

  // Instead of using date.now() to capture the time of data created , using timeStamp
  { timestamps: true }
);

module.exports = mongoose.model("Product", Productschema);
