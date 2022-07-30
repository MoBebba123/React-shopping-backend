const express = require("express");
const { signup, signin, logout, getUserDetails } = require("../controllers/user");
const { isAuthenticatedUser, isAdmin } = require("../middleware/auth");
const router = express.Router();


router.route("/register").post(signup);

router.route("/login").post(signin);
router.route("/logout").get(logout);
router.route("/profile/me").get(isAuthenticatedUser, getUserDetails);

module.exports =  router;