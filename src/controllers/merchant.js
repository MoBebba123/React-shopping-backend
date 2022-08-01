const { Merchant, MerchantItem, StepOption, SingleChoiceItemStep, MultiChoiceItemStep } = require('../models/merchent');
const sendMerchantToken = require('../utils/merchantToken');
const bcrypt = require("bcryptjs");
const catchAsyncError = require('../middleware/catchAsyncError');
const ErrorHandler = require('../utils/error');
const sendEmail = require('../utils/sendEmail');

exports.registerMerchant = catchAsyncError(async (req, res, next) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);
  const merchant = new Merchant({
    ...req.body, password: hash
  })
  await merchant.save();
  sendMerchantToken(merchant, 201, res);

  const message = `thank you for registration ${merchant.owner}, we will contact you soon `
  await sendEmail({
    email: merchant.email,
    subject: "welcome",
    message
  })
  const adminMessage = `you got a new request from  ${merchant.email}`
  await sendEmail({
    email: "admin@admin.com",
    subject: "welcome",
    message: adminMessage
  })
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
exports.logoutMerchant = catchAsyncError(async (req, res, next) => {
  res.cookie("merchant_token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
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

exports.createMerchantItem = catchAsyncError(async (req, res, next) => {


  const merchantItem = new MerchantItem({
    ...req.body, merchantId: req.merchant.id,
  })
  await merchantItem.save();
  res.status(202).json({
    success: true,
    merchantItem,
  })
})

exports.createSingleChoise = catchAsyncError(async (req, res, next) => {

  const merchantItem = await MerchantItem.findById(req.params.id)
  const singleChoises = new SingleChoiceItemStep(req.body)

  merchantItem.steps.push(singleChoises)

  await merchantItem.save();
  await singleChoises.save();
  res.status(201).json({
    merchantItem,
    singleChoises
  })
})
exports.createSingleChoiseOptions = catchAsyncError(async (req, res, next) => {

  const merchantItem = await MerchantItem.findById(req.params.id)

  const singleChoises = new SingleChoiceItemStep(req.body)

  merchantItem.singleSteps.push(singleChoises);

  await singleChoises.save();
  await merchantItem.save();
  res.status(201).json({
    merchantItem,

  })
})
exports.createMultiChoiseOptions = catchAsyncError(async (req, res, next) => {

  const merchantItem = await MerchantItem.findById(req.params.id)

  const multiChoice = new MultiChoiceItemStep(req.body)

  merchantItem.multiSteps.push(multiChoice);

  await multiChoice.save();
  await merchantItem.save();
  res.status(201).json({
    merchantItem,

  })
})

exports.deleteSingleChoice = catchAsyncError(async (req, res, next) => {

  const { itemId, stepId } = req.params

  const merchantItem = await MerchantItem.findOneAndUpdate(
    { _id: itemId },
    {
      $pull: {
        steps: stepId
      }
    },
    { new: true, multi: true },

  )
  const itemSingleChoice = await SingleChoiceItemStep.findById({ _id: stepId })
  await itemSingleChoice.remove();


  res.json({
    message: "done",
    merchantItem
  })
})


exports.getItem = catchAsyncError(async (req, res, next) => {
  const itemId = req.params.itemId

  const merchantItem = await MerchantItem.findOne({ _id: itemId }).populate(
    "singleSteps multiSteps",
  )
  res.json({
    message: "done",
    merchantItem
  })
})



// TODO
// merchant Approval - reject -delete 

