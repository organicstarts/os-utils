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
    name: {
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
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);
questionSchema.virtual("answers", {
  ref: "Answer",
  localField: "_id",
  foreignField: "questionID"
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
