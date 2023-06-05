const { verifyTokenandAdmin } = require("./verifyjwt");
const Product = require("../Models/Product");
const User = require("../Models/User");
const { default: mongoose } = require("mongoose");
const router = require("express").Router();

// only the admin can create, update and delete the product where the users can only get the products
router.post("/createProduct", verifyTokenandAdmin, async (req, res) => {
  const { title, description, img, categories, size, color, price, inStock } =
    req.body;
  try {
    const newProduct = await Product.create({
      title,
      description,
      img,
      categories,
      size,
      color,
      price,
      inStock,
    });

    const saveProduct = await newProduct.save();
    return res.status(201).json(saveProduct);
  } catch (error) {
    console.log(error);
  }
});

// ! updating the product

router.put("/updateProduct/:id", verifyTokenandAdmin, async (req, res) => {
  try {
    // Checking wheter the product id object exists or not in the database
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json("Invalid product ID");
    }

    // once the product exists in the database then update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    //  if the product not found
    if (!updatedProduct) {
      return res.status(500).json("Failed to update product");
    }
    return res.json(updatedProduct);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error");
  }
});

// ! Deleting the product

router.delete("/delete/:id", verifyTokenandAdmin, async (req, res) => {
  try {
    // Checking wheter the product id object exists or not in the database
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json("Invalid product ID");
    }

    // once the product exists in the database then update the product
    const deleteProduct = await Product.findByIdAndDelete(req.params.id);
    //  if the product not found
    if (!deleteProduct) {
      return res.status(500).json("Failed to delete product");
    }
    return res.json("product deleted successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error");
  }
});

// Get products.
router.get("/getproduct/:id", async (req, res) => {
  try {
    const products = await Product.find({ _id: req.params.id });
    return res.status(200).json(products);
  } catch (error) {
    console.log(error);
  }
});

// Get all Products.

// Here any user who is authenticated and authorized can get the products need not to be admin to get/view the products

// ! to find the products the user must enter their userId in the parameters
router.get("/getallProducts", async (req, res) => {
  // defining 2 querries one for 2 product , and other for the categories
  const qNew = req.query.new;
  const qcategories = req.query.categories;
  const qcolor = req.query.color;
  const qsize = req.query.size;

  // ! to find the latest last product
  if (qNew) {
    const findProduct = await Product.find().sort({ createdAt: -1 }).limit(1);
    return res.status(200).json(findProduct);
    // ! to find the categories
  } else if (qcategories) {
    const findProduct = await Product.find({
      // trying to find the categories heref
      // ! if the category query is inside this categories
      categories: { $in: [qcategories.toLowerCase()] },
    });
    // if none of the qury matches then returning a will bring back soon message to users
    if (findProduct.length === 0) {
      return res.status(200).json("will bring back soon");
    } else {
      return res.status(200).json(findProduct);
    }

    // trying to find the products as per the color
  } else if (qcolor) {
    const findProduct = await Product.find({
      // trying to find the categories heref
      // ! if the category query is inside this categories
      color: { $in: [qcolor.toLowerCase()] },
    });
    // if none of the qury matches then returning a will bring back soon message to users
    if (findProduct.length === 0) {
      return res.status(200).json("will bring back soon");
    } else {
      return res.status(200).json(findProduct);
    }
    // trying to find products as per the size
  } else if (qsize) {
    const findProduct = await Product.find({
      // trying to find the categories heref
      // ! if the category query is inside this categories
      size: { $in: [qsize.toUpperCase()] },
    });
    // if none of the qury matches then returning a will bring back soon message to users
    if (findProduct.length === 0) {
      return res.status(200).json("will bring back soon");
    } else {
      return res.status(200).json(findProduct);
    }
  } else {
    const findProduct = await Product.find();
    return res.status(200).json(findProduct);
  }
});

module.exports = router;
