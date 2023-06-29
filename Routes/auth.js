const router = require("express").Router();
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// ! Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // hashing the password before storing into database.
    const salt = await bcrypt.genSaltSync(10);
    const hashed = await bcrypt.hashSync(password, salt);

    // Check if a user with the given email or username already exists in the database
    // ! here i want username and email both to be unique so used $or
    const existingUsers = await User.findOne({
      $or: [{ email }, { username }],
    });
    // handling error if the user already exists
    if (existingUsers) {
      return res.status(409).json({
        message:
          "User with the email or username already exists. Please choose a unique email and username.",
      });
    }

    // ! saving the user into the database
    const newUser = new User({
      username,
      email,
      password: hashed,
    });

    const savedUser = await newUser.save();
    return res.status(201).json(savedUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// ! LOgin
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the existing user in the database
    const registeredUser = await User.findOne({ email });

    if (!registeredUser) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare the passwords using bcrypt.compare() method
    const comparePassword = await bcrypt.compare(
      password,
      registeredUser.password
    );

    if (!comparePassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const payload = {
      userId: registeredUser._id,
      email: registeredUser.email,
      isAdmin: registeredUser.isAdmin,
    };

    const token = Jwt.sign(payload, process.env.JWT_KEY);

    // Destructure the user information and include the isAdmin field
    const { _id, password: userPassword, ...userInfo } = registeredUser._doc;

    // Send the response including the token and user information
    return res.send({ token, ...userInfo });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
