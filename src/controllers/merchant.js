const {
  Merchant,
  Item,
  StepOption,
  SingleChoice,
  MultiChoice,
} = require("../models/merchent");
const sendMerchantToken = require("../utils/merchantToken");
const bcrypt = require("bcryptjs");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/error");
const sendEmail = require("../utils/sendEmail");

exports.registerMerchant = catchAsyncError(async (req, res, next) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);
  const merchant = new Merchant({
    ...req.body,
    password: hash,
  });
  await merchant.save();
  sendMerchantToken(merchant, 201, res);

  const message = `thank you for registration ${merchant.owner}, we will contact you soon `;
  await sendEmail({
    email: merchant.email,
    subject: "welcome",
    message,
  });
  const adminMessage = `you got a new request from  ${merchant.email}`;
  await sendEmail({
    email: "admin@admin.com",
    subject: "welcome",
    message: adminMessage,
  });
});

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
});
exports.logoutMerchant = catchAsyncError(async (req, res, next) => {
  res.cookie("merchant_token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});
// ADMINS
exports.getAllMerchants = catchAsyncError(async (req, res, next) => {
  const merchants = await Merchant.find({}, { createdAt: "-1" });

  if (merchants) {
    res.status(200).json({
      success: true,
      merchants,
    });
  }
});
// USERS
exports.getMerchants = catchAsyncError(async (req, res, next) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;
  const name = req.query.name || "";
  const category = req.query.category || "";
  const owner = req.query.owner || "";
  const affordability = req.query.affordability || "";
  const rating =
    req.query.rating && Number(req.query.rating) !== 0
      ? Number(req.query.rating)
      : 0;

  const nameFilter = name ? { name: { $regex: name, $options: "i" } } : {};
  const ownerFilter = owner ? { owner } : {};
  const categoryFilter = category ? { category } : {};
  const affordabilityFilter = affordability ? { affordability } : {};
  const ratingFilter = rating ? { rating: { $gte: rating } } : {};

  const count = await Merchant.count({
    ...nameFilter,
    ...ownerFilter,
    ...categoryFilter,
    ...affordabilityFilter,
    ...ratingFilter,
  });

  const merchants = await Merchant.find({
    isActive: true,
    ...nameFilter,
    ...ownerFilter,
    ...categoryFilter,
    ...affordabilityFilter,
    ...ratingFilter,
  })
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  if (merchants) {
    res.status(200).json({
      success: true,
      merchants,
      page,
      pages: Math.ceil(count / pageSize),
    });
  }
});

exports.createMerchantItem = catchAsyncError(async (req, res, next) => {
  const merchantItem = new Item({
    ...req.body,
    merchantId: req.merchant.id,
  });
  await merchantItem.save();
  res.status(202).json({
    success: true,
    merchantItem,
  });
});

exports.createSingleChoiseOptions = catchAsyncError(async (req, res, next) => {
  const merchantItem = await Item.findById(req.params.id);

  const singleChoises = new SingleChoice(req.body);

  merchantItem.steps.push(singleChoises);

  await singleChoises.save();
  await merchantItem.save();
  res.status(201).json({
    merchantItem,
  });
});
exports.createMultiChoiseOptions = catchAsyncError(async (req, res, next) => {
  const merchantItem = await Item.findById(req.params.id);

  const multiChoice = new MultiChoice(req.body);

  merchantItem.steps.push(multiChoice);

  await multiChoice.save();
  await merchantItem.save();
  res.status(201).json({
    merchantItem,
  });
});

exports.deleteSingleChoice = catchAsyncError(async (req, res, next) => {
  const { itemId, stepId } = req.params;

  const merchantItem = await Item.findOneAndUpdate(
    { _id: itemId },
    {
      $pull: {
        steps: stepId,
      },
    },
    { new: true, multi: true }
  );

  const itemSingleChoice = await SingleChoice.findById({ _id: stepId });
  await itemSingleChoice.remove();

  res.json({
    message: "done",
    merchantItem,
  });
});

exports.getItem = catchAsyncError(async (req, res, next) => {
  const itemId = req.params.itemId;

  const merchantItem = await Item.findOne({ _id: itemId })
    .populate("singleChoice")
    .populate("multiChoice");
  res.json({
    message: "done",
    merchantItem,
  });
});
exports.getCategories = catchAsyncError(async (req, res, next) => {
  const merchants = await Merchant.find({}).distinct("category");

  res.json({
    merchants,
  });
});

// TODO
// merchant Approval - reject -delete
