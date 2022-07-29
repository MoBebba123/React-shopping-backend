const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    min: 3,
    max: 20,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    min: 3,
    max: 20,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin", "super-admin"],
    default: "user",
  },
  contactNumber: { type: String },
  pofilePicture: { type: String },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
},
  {
    timestamps: true
  })
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});




module.exports = mongoose.model("User", userSchema)