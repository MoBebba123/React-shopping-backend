const { Merchant, MerchantItem, ItemGroup } = require('../models/merchent');
const sendMerchantToken = require('../utils/merchantToken');
const bcrypt = require("bcryptjs");
const catchAsyncError = require('../middleware/catchAsyncError');
const ErrorHandler = require('../utils/error');



exports.registerMerchant = catchAsyncError(async (req, res, next) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, 10);
  const merchant = new Merchant({
    ...req.body, password: hash
  })
  await merchant.save();
  sendMerchantToken(merchant, 201, res);

})

exports.signinMerchant = catchAsyncError(async (req, res, next) => {

  const { password, email } = req.body;


  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const merchant = await Merchant.findOne({ email }).select("+password");

  if (!merchant) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isCorrect = await bcrypt.compare(password, merchant.password);
  if (!isCorrect) return next(new ErrorHandler("Password does not match", 400));



  sendMerchantToken(merchant, 200, res);



})


exports.getAllMerchants = catchAsyncError(async (req, res, next) => {
  const merchants = await Merchant.find({});

  if (merchants) {
    res.status(200).json({
      success: true,
      merchants
    })
  }
})

exports.getMerchants = catchAsyncError(async (req, res, next) => {
  const merchants = await Merchant.find({ isActive: true });

  if (merchants) {
    res.status(200).json({
      success: true,
      merchants
    })
  }
})

// TODO
// merchant Approval - reject -delete 