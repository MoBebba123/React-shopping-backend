const express = require('express');
const { registerMerchant, signinMerchant } = require('../controllers/merchant')

const merchantRouter = express.Router();


merchantRouter.route("/merchant/register").post(registerMerchant);
merchantRouter.route("/merchant/signin").post(signinMerchant);


module.exports = merchantRouter;
