const mongoose = require('mongoose');
const jwt = require("jsonwebtoken")

const Schema = mongoose.Schema;


const multiChoiceItemStepSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, default: 'multi_choice', enum: ['multi_choice'], required: true },
  required: { type: Boolean, required: true },
  minNumberOfChoices: { type: Number, required: true },
  maxNumberOfChoices: { type: Number, required: true },
  options: {
    type: [{
      name: { type: String, required: true },
      isFree: { type: Boolean, required: true },
      price: { type: Number, default: 0.0 },
    }], required: true
  },
});

const singleChoiceItemStepSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, default: 'single_choice', enum: ['single_choice'], required: true },
  required: { type: Boolean, required: true },
  options: {
    type: [
      {
        name: { type: String, required: true },
        isFree: { type: Boolean, required: true },
        price: { type: Number, default: 0.0 },
      },
    ], required: true
  },
});


const merchantItemSchema = new Schema({
  merchantId: { type: Schema.Types.ObjectId, required: true, ref: 'Merchant' },
  category: { type: String, required: true },
  name: { type: String, required: true },
  photo: { type: String, required: true },
  price: { type: Number, required: true },
  calories: { type: Number, default: 0 },
  description: { type: String, required: true },
  steps: { type: [Schema.Types.ObjectId], default: [] },
  // docModel: {
  //   type: String,
  //   required: true,
  //   default: "Single_choice_item_step",
  //   enum: ['Single_choice_item_step', 'Multi_choice_item_step']
  // },
  // singleSteps: { type: [Schema.Types.ObjectId], default: [], ref: "Single_choice_item_step" },
  // multiSteps: { type: [Schema.Types.ObjectId], default: [], ref: "Multi_choice_item_step" },
}, {
  timestamps: true,
  toJSON: { virtuals: true }
},
);
merchantItemSchema.virtual('singleChoice', {
  ref: 'Single_choice_item_step',
  localField: 'steps', 
  foreignField: '_id', 
 
});

merchantItemSchema.virtual('multiChoice', {
  ref: 'Multi_choice_item_step',
  localField: 'steps',
  foreignField: '_id',
});

const categorySchema = new Schema({
  merchantId: { type: Schema.Types.ObjectId, required: true, ref: 'merchant' },
  name: { type: String, required: true },
  items: { type: [Schema.Types.ObjectId], default: [], ref: "Merchant_item" },

});


const merchantSchema = new Schema({
  name: { type: String, required: true },
  hero: { type: String, required: true },
  owner: { type: String, required: true },
  category: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cuisine: { type: String },
  rating: { type: Number, default: 0 },
  orders: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0.99 },
  isActive: { type: Boolean, default: false },
  status: { type: String, required: true, default: "pending" },
  affordability: { type: String, default: '£' },
  deliveryPeriod: { type: String, default: '20-20 Min' },
  city: { type: String, required: true },
  street: { type: String, required: true },
  country: { type: String, required: true },
  postcode: { type: String, required: true },
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
}, { timestamps: true });




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
    });
};


const Merchant = mongoose.model('Merchant', merchantSchema);
const ItemCategory = mongoose.model('Item_caregory', categorySchema);
const MultiChoice= mongoose.model('Multi_choice_item_step', multiChoiceItemStepSchema);
const SingleChoice= mongoose.model('Single_choice_item_step', singleChoiceItemStepSchema);
const Item = mongoose.model('Merchant_item', merchantItemSchema);


module.exports = {
  Merchant,
  ItemCategory,
  Item,
  MultiChoice,
  SingleChoice
};

