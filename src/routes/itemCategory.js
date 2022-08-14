const express = require("express");
const { createCategory } = require("../controllers/itemCategory");
const { isAuthenticatedMerchant } = require("../middleware/auth");

const router = express.Router();

router.route("/create-category").post(isAuthenticatedMerchant, createCategory);

module.exports = router;
