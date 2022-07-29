
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    logo:{
        public_id: {
          type: String,
          default:""
        },
        url: {
          type: String,
          default:""
        },
      },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    category: {
        type: String,
        required: true

    },
    isActive: {
        type: Boolean,
        default: false
    },
    address: { type: String, required: true },
    country: { type: String, required: true },
    pinCode: { type: Number, required: true },
    city: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    
    rating: { type: Number, default: 0, required: true },
    numReviews: { type: Number, default: 0, required: true },
    status: {
        type: String,
        default: 'pendding',
        enum: ['pendding', 'rejected', 'approved']
    },

},
    {
        timestamps: true
    })
userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});




module.exports = mongoose.model("User", userSchema)