const User = require("../Models/User");
const {
  verifyTokenandAuthorization,
  verifyToken,
  verifyTokenandAdmin,
} = require("./verifyjwt");
const bcrypt = require("bcrypt");
const router = require("express").Router();

// updating the user details
router.put("/update/:id", verifyTokenandAuthorization, async (req, res) => {
  if (req.body.password) {
    const salt = await bcrypt.genSaltSync(10);
    req.body.password = await bcrypt.hashSync(req.body.password, salt);
  }
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      // ! used to store the changes in the req.body
      { $set: req.body },
      // ! until and unless the the req.body changes is set to true , changes wont be reflected.
      { new: true }
    );

    // if the user wants to update the password ,hashing it before stored in database

    res.status(201).json(updateUser);
  } catch (error) {
    console.log(error, "Internal server error");
  }
});

// deleting the user account
router.delete("/delete/:id", verifyTokenandAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.send("account deleted successfully");
  } catch (error) {
    console.log(error);
  }
});

// getting user details
router.get("/details/:id", verifyTokenandAdmin, async (req, res) => {
  try {
    const findUser = await User.findById(req.params.id);
    // getting the entire user details except the password using destructuring below.
    const { password, ...others } = findUser._doc;
    return res.status(200).json({ ...others });
  } catch (error) {
    console.log(error);
  }
});

// getting all the users through querry
// suppose user wants to get the details of the last 5 users with using query
router.get("/allusers", verifyTokenandAdmin, async (req, res) => {
  const query = req.query.new;
  const users = query
    ? await User.find().sort({ _id: -1 }).limit(4)
    : await User.find();
  try {
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
});

// get user stats.
router.get("/stats", verifyTokenandAdmin, async (req, res) => {
  // to get the analytics for the admin dashboard.
  // ! getting todays date
  const date = new Date();
  // ! getting lastyear
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    // have to group the items to get the user statistics per month.
    // !  to generate a report on user registrations over the past year
    const data = await User.aggregate([
      // filtering the createdAt if it is less than today and greater than last year
      { $match: { createdAt: { $gte: lastYear } } },

      // reshaping the document
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },

      // grouping all together to get the user registration
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
