const {
  Merchant,
  Item,
  SingleChoice,
  MultiChoice,
} = require("../models/merchent");
const sendMerchantToken = require("../utils/merchantToken");
const bcrypt = require("bcryptjs");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/error");
const sendEmail = require("../utils/sendEmail");
const sendSms = require("../utils/sendSms");
const cloudinary = require("cloudinary");
exports.registerMerchant = catchAsyncError(async (req, res, next) => {
  // const myCloud = await cloudinary.v2.uploader.upload(req.body.hero, {
  //   folder: "avatars",
  //   width: 150,
  //   crop: "scale",
  // });

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);

  const merchant = new Merchant({
    ...req.body,
    password: hash,
    // hero: {
    //   public_id: myCloud ? myCloud.public_id : "sampleid",
    //   url: myCloud ? myCloud.secure_url : "sampleurl",
    // },
  });
  await merchant.save();
  sendMerchantToken(merchant, 201, res);
  sendSms({
    to: merchant.phoneNumber,
    message: "thank you for your registration",
  });

  //const message = `thank you for registration ${merchant.owner}, we will contact you soon `;
  // await sendEmail({
  //   email: merchant.email,
  //   subject: "welcome",
  //   message,
  // });
  // const adminMessage = `you got a new request from  ${merchant.email}`;
  // await sendEmail({
  //   email: "admin@admin.com",
  //   subject: "welcome",
  //   message: adminMessage,
  // });
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
  const pageSize = 2;
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
  // cloudinary later
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
    { new: true }
  );

  const itemSingleChoice = await SingleChoice.findById({ _id: stepId });
  await itemSingleChoice.remove();

  res.json({
    message: "done",
    merchantItem,
  });
});
exports.deleteMultiChoice = catchAsyncError(async (req, res, next) => {
  const { itemId, stepId } = req.params;

  const merchantItem = await Item.findOneAndUpdate(
    { _id: itemId },
    {
      $pull: {
        steps: stepId,
      },
    },
    { new: true }
  );

  const itemMultiChoice = await MultiChoice.findById({ _id: stepId });
  await itemMultiChoice.remove();

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

exports.deleteMerchant = catchAsyncError(async (req, res, next) => {
  const merchant = await Merchant.findByIdAndDelete(req.params.merchantId);
  if (merchant) {
    res.json({
      message: "merchant deleted",
    });
  } else {
    res.status(404).json({
      message: "merchant not found",
    });
  }
});

exports.updateMerchant = catchAsyncError(async (req, res, next) => {
  const merchant = await Merchant.findById(req.merchant.id);
  const file = req.body.hero;
  if (merchant.hero.public_id !== "" && file) {
    const imageId = merchant.hero.public_id;

    await cloudinary.v2.uploader.destroy(imageId);
  }

  if (file) {
    const myCloud = await cloudinary.v2.uploader.upload(file, {
      folder: "proimages",
      scale: true,
      crop: 160,
    });
    if (merchant) {
      merchant.name = req.body.name || merchant.name;
      merchant.owner = req.body.owner || merchant.owner;
      merchant.email = req.body.email || merchant.email;
      merchant.cuisine = req.body.cuisine || merchant.cuisine;
      merchant.phoneNumber = req.body.phoneNumber || merchant.phoneNumber;
      merchant.deliveryFee = req.body.deliveryFee || merchant.deliveryFee;
      merchant.city = req.body.city || merchant.city;
      merchant.street = req.body.street || merchant.street;
      merchant.country = req.body.country || merchant.country;
      merchant.postcode = req.body.postcode || merchant.postcode;
      merchant.longitude = req.body.longitude || merchant.longitude;
      merchant.latitude = req.body.latitude || merchant.latitude;
      merchant.hero.public_id = myCloud?.public_id || merchant.hero.public_id;
      merchant.hero.url = myCloud?.secure_url || merchant.hero.url;
    }
  } else {
    merchant.name = req.body.name || merchant.name;
    merchant.owner = req.body.owner || merchant.owner;
    merchant.email = req.body.email || merchant.email;
    merchant.cuisine = req.body.cuisine || merchant.cuisine;
    merchant.phoneNumber = req.body.phoneNumber || merchant.phoneNumber;
    merchant.deliveryFee = req.body.deliveryFee || merchant.deliveryFee;
    merchant.city = req.body.city || merchant.city;
    merchant.street = req.body.street || merchant.street;
    merchant.country = req.body.country || merchant.country;
    merchant.postcode = req.body.postcode || merchant.postcode;
    merchant.longitude = req.body.longitude || merchant.longitude;
    merchant.latitude = req.body.latitude || merchant.latitude;
    merchant.email = req.body.email || merchant.email;
  }

  await merchant.save({
    validateBeforeSave: false,
  });
  res.status(200).json({
    succuss: true,
    message: "merchant Updated succussfully",
    merchant,
  });
});

exports.approveOrRejectMerchant = catchAsyncError(async (req, res, next) => {
  const merchantId = req.params.merchantId;
  const query = { _id: merchantId };

  const decision = req.path.split("/")[2];
  console.log(decision);
  let update = {
    status: decision === "reject" ? "rejected" : "approved",
    isActive: decision === "reject" ? false : true,
  };

  const merchant = await Merchant.findOneAndUpdate(query, update, {
    new: true,
    useFindAndModify: true,
  });
  if (!merchant) return next(new ErrorHandler("merchant not found", 404));

  const message = `congratulations ${merchant.owner} you have been accepted to sell on tawwan eats`;
  await sendEmail({
    email: merchant.email,
    subject: `Seller request Approved`,
    message: message,
  });
  res.status(200).json({
    success: true,
    message: "merchant approved",
    merchant,
  });
});
