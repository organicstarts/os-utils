const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productID: {
    type: String,
    required: true,
    trim: true
  }
});

productSchema.virtual("questions", {
  ref: "Question",
  localField: "_id",
  foreignField: "product"
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
