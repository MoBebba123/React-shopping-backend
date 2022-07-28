const mongoose = require("mongoose");
const Schema =  mongoose.Schema;

const userSchema =  new Schema({
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
      hash_password: {
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
},
{
    timestamps: true
})


module.exports = mongoose.Schema("User", userSchema)