var mongoose = require('mongoose');

var bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
  name : {
    type : String,
    minlength : 4,
    maxlength : 20,
    required : true,
  },
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
    type : String,
    required : true
  },
  quizIds : [
      {
        type : mongoose.Schema.Types.ObjectId,
        ref : "quiz"
      }
  ]
},{timeStamp : true});

userSchema.pre("save" , async function (next)  {
    try {
      var salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password , salt);
      next();
    } catch (error) {
       next(error);
    }
})

userSchema.methods.verifyPassword = async function(password ,next) {
   try {
    return await bcrypt.compare(password , this.password); 
   } catch (error) {
     next(error)
   }
}


var User =  mongoose.model("User" , userSchema);

module.exports = User;