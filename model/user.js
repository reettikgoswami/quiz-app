var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  username : {
    type : String,
    maxlength : 15,
    minlength : 5,
    required : true,
    unique : true
  },
  email : {
    type : String,
    lowercase : true,
    required : true,
    unique : true,
  },
  password : {
    type : String
  },
  quizIDs : [
      {
        type : mongoose.Schema.Types.ObjectId,
        ref : "quiz"
      }
  ]
},{timeStamp : true});

var User =  mongoose.model("User" , userSchema);

module.exports = User;