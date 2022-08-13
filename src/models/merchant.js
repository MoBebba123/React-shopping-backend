const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const merchantSchema = new Schema(
  {
    name: { type: String, required: true },
    hero: {
      public_id: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
    },
    owner: { type: String, required: true },
    category: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cuisine: { type: String },
    phoneNumber: { type: String },
    rating: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0.99 },
    isActive: { type: Boolean, default: false },
    status: { type: String, required: true, default: "pending" },
    affordability: { type: String, default: "£" },
    deliveryPeriod: { type: String, default: "20-20 Min" },
    city: { type: String, required: true },
    street: { type: String, required: true },
    country: { type: String, required: true },
    postcode: { type: String, required: true },
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },

    otp: Number,
    otp_expiry: Date,
  },
  { timestamps: true }
);

// JWT TOKEN
merchantSchema.methods.getJWTToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      longitude: this.longitude,
      latitude: this.latitude,
      isActive: this.isActive,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

const Merchant = mongoose.model("Merchant", merchantSchema);

module.exports = {
  Merchant,
};
