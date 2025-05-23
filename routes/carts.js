const express = require("express");
const {
  addCart,
  getCartItems,
  removeCartItems,
} = require("../controller/CartController");
const router = express.Router();

// router.use(express.json());

router.post("/", addCart);

router.get("/", getCartItems);

router.delete("/:id", removeCartItems);

router.get("/", getCartItems);

module.exports = router;
