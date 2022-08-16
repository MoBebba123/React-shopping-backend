const express = require("express");
const { createCategory, findCategory } = require("../controllers/itemCategory");
const { isAuthenticatedMerchant } = require("../middleware/auth");

const router = express.Router();

router.route("/create-category").post(isAuthenticatedMerchant, createCategory);
router.route("/find-category/:merchantId").get(findCategory);

module.exports = router;
