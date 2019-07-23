const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true
    },
    points: {
      type: Number,
      default: 0
    },
    thumbVote: {
      type: Map,
      of: Number,
      default: {}
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product"
    }
  },
  {
    timestamps: true
  }
);
questionSchema.virtual("answers", {
  ref: "Answer",
  localField: "_id",
  foreignField: "answer"
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
