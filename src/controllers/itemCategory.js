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

exports.findCategory = catchAsyncError(async (req, res, next) => {
  const merchantId = req.params.merchantId;
  const query = { merchant: merchantId };
  const merchantCategory = await Category.find(query).populate("items");

  res.status(200).json({
    success: true,
    message: "successfull",
    merchantCategory,
  });
});

exports.updateCategory = catchAsyncError(async (req, res, next) => {
  const CategoryId = req.params.CategoryId;
  const category = Category.findById(CategoryId);
});
