const express = require("express");
const router = express.Router();
const Product = require("../models/products.models");

router.get("/products", function (req, res) {
  //showing all products
});

router.post("/products", function (req, res) {
  //product creation
});

module.exports = router;
