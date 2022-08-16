const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    merchant: { type: Schema.Types.ObjectId, required: true, ref: "Merchant" },
    name: { type: String, required: true },
    items: { type: [Schema.Types.ObjectId], default: [], ref: "Item" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", categorySchema);
