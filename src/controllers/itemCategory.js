const catchAsyncError = require("../middleware/catchAsyncError");
const Category = require("../models/itemCategory");
exports.createCategory = catchAsyncError(async (req, res, next) => {
  const category = new Category({
    ...req.body,
    merchant: req.merchant.id,
  });

  await category.save();

  res.status(202).json({
    message: "Category created successfully",
    category,
  });
});

exports.updateCategory = catchAsyncError(async (req, res, next) => {});
