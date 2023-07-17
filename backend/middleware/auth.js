const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.json({
        success: false,
        message: "Please Login First to access this!",
      });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);

    next();
  } catch (error) {
    res.json(error.message);
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.json({
        success: false,
        message: "You are not authenticated to access this!",
      });
    }
    next();
  } catch (error) {
    res.json(error.message,"jhello");
  }
};
