const express = require("express");
const { createOrder } = require("../controllers/order");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

router.route("/api/create-order").post(isAuthenticatedUser, createOrder);

module.exports = router;
