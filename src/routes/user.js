const express = require("express");
const { signup, signin, logout, getUserDetails, getAllUsers, getSingleUser, updateUserRole, updateUserProfile, deleteProfilePicture, deleteUser } = require("../controllers/user");
const { isAuthenticatedUser, isAdmin } = require("../middleware/auth");
const router = express.Router();


router.route("/register").post(signup);

router.route("/login").post(signin);
router.route("/logout").get(logout);
router.route("/profile/me").get(isAuthenticatedUser, getUserDetails);
router.route("/admin/users").get(isAuthenticatedUser,isAdmin, getAllUsers);
router.route("/admin/user/:id")
.get(isAuthenticatedUser,isAdmin, getSingleUser)
.put(isAuthenticatedUser,isAdmin,updateUserRole);
router.route("/user/updateProfile").put(isAuthenticatedUser,updateUserProfile)
router.route("/user/avatar/delete").put(isAuthenticatedUser,deleteProfilePicture);
router.route("/admin/user/:id").delete(isAuthenticatedUser,isAdmin, deleteUser);

module.exports =  router;