const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const port = process.env.PORT || 5000;
const userRoute = require("./Routes/user");
const productRoute = require("./Routes/product");
const cartRoute = require("./Routes/cart");
const authRoute = require("./Routes/auth");
const orderRoute = require("./Routes/order");
const stripeRoute = require("./Routes/stripe");
const cors = require("cors");

dotenv.config();

const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to Database");
  } catch (error) {
    console.log("Failed to connect to database", error);
  }
};

connection();

app.use(cors());

// ! if we want the server to accept json i,e if the user wants to post the data and that data should be in a form of json then the below code is required , without that we get error properties undefined
app.use(express.json());
// router of the users
app.use("/api/users", userRoute);

// router of the authentication.
app.use("/api/auth", authRoute);

// router of the product
app.use("/api/product", productRoute);

// router of the cart
app.use("/api/cart", cartRoute);

// router of the order
app.use("/api/orders", orderRoute);

//router of the payments(stripe)
app.use("/api/payments", stripeRoute);

app.listen(port, () => {
  console.log(`server started running on port  http://localhost:${port}`);
});
