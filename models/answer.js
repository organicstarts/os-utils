const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
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
    questionID: {
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
