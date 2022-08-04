const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/error");
const catchAsyncError = require("./catchAsyncError");
const User = require("../models/user");
const { Merchant } = require("../models/merchent");

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const access_token = req.cookies.access_token;
  if (!access_token) {
    return next(new ErrorHandler("Please Login to access this resource", 401));
  }

  const decodedData = jwt.verify(access_token, process.env.JWT_SECRET);
  req.user = await User.findById(decodedData.id);

  next();
});
exports.isVerifiedAccount = catchAsyncError(async (req, res, next) => {
  if (req.user && req.user.isVerified) {
    next();
  } else {
    res.status(401).send({ message: "Account must be verified" });
  }
});

exports.isAuthenticatedMerchant = catchAsyncError(async (req, res, next) => {
  const merchant_token = req.cookies.merchant_token;
  if (!merchant_token) {
    return next(new ErrorHandler("Please Login to access this resource", 401));
  }

  const decodedData = jwt.verify(merchant_token, process.env.JWT_SECRET);
  req.merchant = await Merchant.findById(decodedData.id);

  next();
});

exports.isAdmin = catchAsyncError(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401).send({ message: "Invalid Admin Token" });
  }
});

exports.isMerchent = catchAsyncError(async (req, res, next) => {
  if (req.user && req.user.role === "merchent") {
    next();
  } else {
    res.status(401).send({ message: "Invalid merchent Token" });
  }
});

exports.isMerchentOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "merchent")) {
    next();
  } else {
    res.status(401).send({ message: "Invalid Admin/merchent Token" });
  }
};
