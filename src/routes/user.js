const express = require("express");
const { signup } = require("../controllers/user");
const User = require('../schemas/user')
const router = express.Router();


router.route("/signin").post(signup)


module.exports =  router;