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
        qunatity: {
          // ! when user adds the product to the cart by default the quantity of the product will be 1 where the use can increase the quantity.
          type: Number,
          default: 1,
        },
      },
    ],
  },

  // Instead of using date.now() to capture the time of data created , using timeStamp
  { timestamps: true }
);

module.exports = mongoose.model("Cart", Cartschema);
