const express = require("express");
const {
  registerMerchant,
  signinMerchant,
  getAllMerchants,
  getCategories,
  getMerchants,
  createMerchantItem,
  createMultiChoiseOptions,
  logoutMerchant,
  createSingleChoise,
  createSingleChoiseOptions,
  deleteSingleChoice,
  getItem,
  deleteMultiChoice,
  deleteMerchant,
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
  .route("/merchants/createItem")
  .post(isAuthenticatedMerchant, createMerchantItem);
merchantRouter
  .route("/merchants/createItem/singlechoise/:id")
  .post(isAuthenticatedMerchant, createSingleChoiseOptions);
merchantRouter
  .route("/merchants/createItem/multichoise/:id")
  .post(isAuthenticatedMerchant, createMultiChoiseOptions);
merchantRouter
  .route("/merchant/removeSinglechoice/:itemId/:stepId")
  .put(isAuthenticatedMerchant, deleteSingleChoice);
merchantRouter
  .route("/merchant/removeMultichoice/:itemId/:stepId")
  .put(isAuthenticatedMerchant, deleteMultiChoice);
merchantRouter
  .route("/merchant/item/:itemId")
  .get(isAuthenticatedMerchant, getItem);

module.exports = merchantRouter;
