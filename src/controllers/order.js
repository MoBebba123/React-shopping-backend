const catchAsyncError = require("../middleware/catchAsyncError");
const Order = require("../models/order");

exports.createOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    subTotal,
  } = req.body;

  const order = await Order.create({
    customer: req.user.id,
    merchant: req.params.merchantId,
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    subTotal,
    totalPrice,
    paidAt: Date.now(),
  });

  res.status(201).json({
    success: true,
    order,
  });
});
