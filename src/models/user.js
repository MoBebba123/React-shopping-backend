const mongoose = require("mongoose");

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
    enum: ["user", "marchent", "worker", "admin"],
    default: "user",
  },
  merchant: {
    type: Schema.Types.ObjectId,
    ref: "Merchent",
    required: true,
    default: null
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
      default: ""
    },
    url: {
      type: String,
      required:true,
      default: ""
    },
  },
  contactNumber: { type: String },
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