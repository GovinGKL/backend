const mongoose = require("mongoose");

const Cartschema = new mongoose.Schema(
  {
    product: [
      {
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    userId: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    address: {
      type: Object,
    },

    status: {
      type: String,
      default: "pending",
    },
  },

  // Instead of using date.now() to capture the time of data created , using timeStamp
  { timestamps: true }
);

module.exports = mongoose.model("Order", Cartschema);
