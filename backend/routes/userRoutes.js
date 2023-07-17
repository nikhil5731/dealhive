const {
  registerUser,
  loginUser,
  logout,
  updateProfile,
  allUsers,
} = require("../controllers/userController");

const { isAuthenticated, isAdmin } = require("../middleware/auth");

const router = require("express").Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(logout);

router.route("/updateprofile").put(isAuthenticated, updateProfile);

router.route("/admin/users").get(isAuthenticated, isAdmin, allUsers);

module.exports = router;
