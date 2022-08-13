const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const multiChoiceItemStepSchema = new Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    default: "multi_choice",
    enum: ["multi_choice"],
    required: true,
  },
  required: { type: Boolean, required: true },
  minNumberOfChoices: { type: Number, required: true },
  maxNumberOfChoices: { type: Number, required: true },
  options: {
    type: [
      {
        name: { type: String, required: true },
        isFree: { type: Boolean, required: true },
        price: { type: Number, default: 0.0 },
      },
    ],
    required: true,
  },
});

const singleChoiceItemStepSchema = new Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    default: "single_choice",
    enum: ["single_choice"],
    required: true,
  },
  required: { type: Boolean, required: true },
  options: {
    type: [
      {
        name: { type: String, required: true },
        isFree: { type: Boolean, required: true },
        price: { type: Number, default: 0.0 },
      },
    ],
    required: true,
  },
});

const merchantItemSchema = new Schema(
  {
    merchant: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Merchant",
    },
    category: { type: String, required: true },
    name: { type: String, required: true },
    photo: {
      public_id: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
    },
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);
merchantItemSchema.virtual("singleChoice", {
  ref: "Single_choice_item_step",
  localField: "steps",
  foreignField: "_id",
});

merchantItemSchema.virtual("multiChoice", {
  ref: "Multi_choice_item_step",
  localField: "steps",
  foreignField: "_id",
});

const MultiChoice = mongoose.model(
  "Multi_choice_item_step",
  multiChoiceItemStepSchema
);
const SingleChoice = mongoose.model(
  "Single_choice_item_step",
  singleChoiceItemStepSchema
);
const Item = mongoose.model("Item", merchantItemSchema);

module.exports = {
  Item,
  SingleChoice,
  MultiChoice,
};
