const Order = require("../Models/Order");
const {
  verifyToken,
  verifyTokenandAuthorization,
  verifyTokenandAdmin,
} = require("./verifyjwt");

const router = require("express").Router();

router.post("/createOrder", verifyToken, async (req, res) => {
  const newOrder = await Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    return res.status(201).json(savedOrder);
  } catch (error) {
    console.log(error);
  }
});

// updating an order
// ! only admin can update the order.
router.put("/updateOrder/:id", verifyTokenandAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// deleting the order
// ! only the admin can delete the cart.
router.delete("/deleteOrder/:id", verifyTokenandAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order deleted successfully");
  } catch (error) {
    return res.status(500).json(error);
  }
});

// Get user Orders
// ! here users can view their orders.
router.get(
  "/getOrders/:userId",
  // users can view all their orders
  verifyToken,
  async (req, res) => {
    try {
      // using findOne because every user has one cart
      const orders = await Order.find({ userId: req.params.userId });
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
);

// get all carts
// only the admin can get this not a user
router.get("/getallCarts", verifyTokenandAdmin, async (req, res) => {
  try {
    // only to admin
    const allOrders = await Order.find();
    return res.status(200).json(allOrders);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// Get Monthly Income

router.get("/income", verifyTokenandAdmin, async (req, res) => {
  //getting monthly income of the orders
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      { $project: { month: { $month: "$createdAt" }, sales: "$amount" } },
      { $group: { _id: "$month", total: { $sum: "$sales" } } },
    ]);
    return res.status(200).json(income);
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
});

module.exports = router;
