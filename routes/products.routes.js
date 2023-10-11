const express = require("express");
const router = express.Router();
const Product = require("../models/products.models");
const multer = require("multer");

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

//=======post========
router.post("/products", upload.single("image"), function (req, res) {
  const { name, description, price } = req.body;
  const imageUrl = req.file ? req.file.path : null;

  const newProduct = new Product({
    name,
    description,
    price,
    imageUrl,
  });

  newProduct
    .save()
    .then((savedProduct) => {
      res.redirect("/dashboard");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Error creating product" });
    });
});

//=======get=======
router.get("/products", async function (req, res) {
  try {
    const products = await Product.find({}).exec();

    res.render("products", {
      existingProducts: products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching products" });
  }
});

router.get("/dashboard", async function (req, res) {
  try {
    if (req.isAuthenticated() && req.user.isadmin) {
      const products = await Product.find({}).exec();

      res.render("admin/dashboard", {
        user: req.user,
        existingProducts: products,
      });
    } else {
      res.redirect("/login");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching products" });
  }
});

//========deletion========
router.delete("/products/:productId", function (req, res) {
  const productId = req.params.productId;

  Product.findByIdAndRemove(productId, function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error deleting product" });
    } else {
      res.status(200).json({ message: "Product deleted successfully" });
    }
  });
});

module.exports = router;
