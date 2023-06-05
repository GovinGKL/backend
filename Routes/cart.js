const {
  verifyToken,
  verifyTokenandAuthorization,
  verifyTokenandAdmin,
} = require("./verifyjwt");
const Cart = require("../Models/Cart");

const router = require("express").Router();

// creating a cart any genuine user can create a cart
router.post("/createCart", verifyToken, async (req, res) => {
  const newCart = await Cart(req.body);
  try {
    const savedCart = await newCart.save();
    return res.status(201).json(savedCart);
  } catch (error) {
    console.log(error);
  }
});

// updating a cart need to make sure that the user is authorized
router.put("/updateCart/:id", verifyTokenandAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// deleting the cart
router.delete(
  "/deleteCart/:id",
  verifyTokenandAuthorization,
  async (req, res) => {
    try {
      await Cart.findByIdAndDelete(req.params.id);
      res.status(200).json("item deleted successfully");
    } catch (error) {
      return res.status(500).json(error);
    }
  }
);

// Get user cart
router.get(
  // ? for getting cart details should i use userId or the id of the cart. TODO
  // ! coz verifytoken takes req.params.id and not userId
  "/getallCarts/:userId",
  // verifyTokenandAuthorization,
  verifyToken,
  async (req, res) => {
    try {
      // using findOne because every user has one cart
      const cart = await Cart.findOne({ userId: req.params.userId });

      return res.status(200).json(cart);
    } catch (error) {}
  }
);

// get all carts
// only the admin can get this not a user
router.get("/getallCartsAdmin", verifyTokenandAdmin, async (req, res) => {
  try {
    // only to admin
    const allCart = await Cart.find();
    return res.status(200).json(allCart);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
