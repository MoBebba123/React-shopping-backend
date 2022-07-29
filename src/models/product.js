const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    prices: {
        type: [Number],
        required: true,
    },
    merchant: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    picture: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },
    extraOptions: {
        type: [
            {
                text: { type: String },
                price: { type: Number },
            },
        ],
    },

},
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Product", productSchema)