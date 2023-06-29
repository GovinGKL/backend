const mongoose = require("mongoose");

const Cartschema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    product: [
      {
        // ! here user can add multiple products to the cart and that product contains the id
        productId: {
          type: String,
        },
        productTitle: {
          type: String,
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
        quantity: {
          // ! when user adds the product to the cart by default the quantity of the product will be 1 where the use can increase the quantity.
          type: Number,
          default: 1,
        },
      },
    ],
    amount: {
      type: Number,
    },
  },

  // Instead of using date.now() to capture the time of data created , using timeStamp
  { timestamps: true }
);

module.exports = mongoose.model("Cart", Cartschema);
