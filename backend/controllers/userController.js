const User = require("../models/userModel");
const sendToken = require("../utils/jwttoken");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.create({
      name,
      email,
      password,
    });

    sendToken(user, 201, res);
  } catch (error) {
    if (error.code === 11000) {
      return res.json({
        success: false,
        message: "Email is Already Registered!",
      });
    }
    res.json(error.message);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.json({
        success: false,
        message: "User is not Registered!",
      });
    }

    const isPassCorrect = await user.comparePassword(password);

    if (!isPassCorrect) {
      return res.json({
        success: false,
        message: "Invalid Password",
      });
    }

    sendToken(user, 201, res);
  } catch (error) {
    res.json(error);
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  } catch (error) {
    res.json(error.message);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { newName } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: newName },
      { returnOriginal: false }
    );

    if (!user) {
      return res.json({
        success: false,
        message: "Email is Not registered!",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.json(error.message);
  }
};

exports.allUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.json(error.message);
  }
};
