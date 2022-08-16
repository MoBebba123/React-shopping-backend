const { Item, SingleChoice, MultiChoice } = require("../models/merchnatItem");
const { Merchant } = require("../models/merchant");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/error");
const sendEmail = require("../utils/sendEmail");
const sendSms = require("../utils/sendSms");
const cloudinary = require("cloudinary");

exports.createMerchantItem = catchAsyncError(async (req, res, next) => {
  // cloudinary later
  const merchantItem = new Item({
    ...req.body,
    merchant: req.merchant.id,
  });
  await merchantItem.save();
  res.status(202).json({
    success: true,
    merchantItem,
  });
});
exports.updateMerchantItem = catchAsyncError(async (req, res, next) => {
  if (req.file) {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.hero, {
      folder: "hero",
      width: 150,
      crop: "scale",
    });
    const merchantItem = await Item.findByIdAndUpdate(
      req.params.itemId,
      {
        $set: {
          ...req.body,
          "hero.$.public_id": myCloud.public_id,
          "hero.$.url": myCloud.secure_url,
        },
      },
      {
        new: true,
      }
    );
    res.status(202).json({
      success: true,
      merchantItem,
    });
  } else {
    const merchantItem = await Item.findByIdAndUpdate(
      req.params.itemId,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(202).json({
      success: true,
      merchantItem,
    });
  }
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
exports.getMerchantItems = catchAsyncError(async (req, res, next) => {
  const merchantId = req.params.merchantId;
  const query = { merchant: merchantId };
  Item.find(query).exec((err, items) => {
    if (err) return next(new ErrorHandler("merchant not found", 404));
    if (items) {
      res.status(200).json({
        success: true,
        message: "get items",
        items,
      });
    }
  });
});
