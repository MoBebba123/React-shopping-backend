const express = require('express');
const { registerMerchant, signinMerchant, getAllMerchants,getMerchants } = require('../controllers/merchant');
const { isAuthenticatedUser, isAdmin } = require('../middleware/auth');

const merchantRouter = express.Router();


merchantRouter.route("/merchant/register").post(registerMerchant);
merchantRouter.route("/merchant/signin").post(signinMerchant);
merchantRouter.route("/admin/merchants").get( isAuthenticatedUser, isAdmin, getAllMerchants);

merchantRouter.route("/user/merchants").get( getMerchants);

module.exports = merchantRouter;
