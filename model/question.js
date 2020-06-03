var mongoose = require("mongoose");

var questionSchema = new mongoose.Schema(
  {
    quizID: {
      type: String,
    },
    author: {
      type: String,
    },
    question: {
      type: String,
    },
    options: [
      {
        type: String,
      },
    ],
    rightOptions : [
      {
        type : String
      }
    ]
  },
  { timeStamp: true }
);

var Question = mongoose.model("Question", questionSchema);
module.exports = Question;
