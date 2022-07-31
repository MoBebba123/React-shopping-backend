const express = require('express');
const { getMerchants, getMerchant } = require('../controllers/merchant')

const merchantRouter = express.Router();

merchantRouter.route("/merchants").get(getMerchants);
merchantRouter.get('/merchant/:id', getMerchant);

module.exports = merchantRouter;
