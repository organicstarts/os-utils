const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    productID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product"
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Question"
    }
  },
  {
    timestamps: true
  }
);

const Answer = mongoose.model("Answer", answerSchema);

module.exports = Answer;
