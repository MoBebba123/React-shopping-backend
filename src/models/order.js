const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  orderItems: [
    {
      item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
  shippingInfo: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pinCode: { type: String, required: true },
    phoneNo: { type: Number, required: true },
  },
  shipingPrice: { type: Number, required: true, default: 0 },
  taxPrice: { type: Number, required: true, default: 0 },
  subTotal: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  paymentInfo: {
    id: { type: String, required: true },
    status: { type: String, required: true },
  },
  paidAt: { type: Date, required: true },
  orderStatus: { type: String, required: true, default: "Processing" },
  createdAt: { type: Date, default: Date.now },
  deliveredAt: Date,
});

module.exports = mongoose.model("Order", orderSchema);
