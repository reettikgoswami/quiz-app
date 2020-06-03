var mongoose = require("mongoose"); 

var quizSchema = new mongoose.Schema({
  authorID : {
    type : String
  },
  title : {
    type : String,
    maxlength : 18,
  },
  questions : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Question"
  }]
}, { timeStamp: true });

var Quiz = mongoose.model("Quiz", quizSchema);
module.exports = Quiz;
