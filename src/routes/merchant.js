const express = require("express");
const {
  registerMerchant,
  signinMerchant,
  getAllMerchants,
  getCategories,
  getMerchants,
  logoutMerchant,
  deleteMerchant,
  updateMerchant,
  approveOrRejectMerchant,
} = require("../controllers/merchant");
const {
  isAuthenticatedUser,
  isAdmin,
  isAuthenticatedMerchant,
} = require("../middleware/auth");

const merchantRouter = express.Router();

merchantRouter.route("/merchant/register").post(registerMerchant);
merchantRouter.route("/merchant/signin").post(signinMerchant);
merchantRouter.route("/merchant/signout").get(logoutMerchant);
merchantRouter
  .route("/admin/merchants")
  .get(isAuthenticatedUser, isAdmin, getAllMerchants);
merchantRouter
  .route("/admin/merchant/:merchantId")
  .delete(isAuthenticatedUser, isAdmin, deleteMerchant);
merchantRouter.route("/merchants/category").get(getCategories);

merchantRouter.route("/user/merchants").get(getMerchants);
merchantRouter
  .route("/merchant/update")
  .put(isAuthenticatedMerchant, updateMerchant);

merchantRouter
  .route("/merchant/approve/:merchantId")
  .put(isAuthenticatedUser, isAdmin, approveOrRejectMerchant);
merchantRouter
  .route("/merchant/reject/:merchantId")
  .put(isAuthenticatedUser, isAdmin, approveOrRejectMerchant);
module.exports = merchantRouter;
