var mongoose = require("mongoose");

// utils imports
var { isValidUser } = require("../utils/userUtil");
var {generateJwtToken} = require("../utils/auth");
// Database imports
var Quiz = require("../model/quiz");
var Question = require("../model/question");
var User = require("../model/user");

var register = async (req, res, next) => {
  try {
    var {user} = req.body;
    var validatedUserStatus = isValidUser(user);

    if (!validatedUserStatus.status) {
      return res.status(400).send({ ...validatedUserStatus });
    }
    if( await User.findOne({username : user.username})){
      validatedUserStatus.status = false;
      validatedUserStatus.username = " username already taken";
    }
    if( await User.findOne({email : user.email})){
      validatedUserStatus.status = false;
      validatedUserStatus.email = " email already taken";
    }

    if(!validatedUserStatus.status){
      return res.status(400).send({ ...validatedUserStatus });
    }
    
    user.quizIds = []; 
   
    var newUser = await User.create(user);
      
    var token = await generateJwtToken(newUser);

     res.status(200).send({user : newUser , token});

  } catch (error) {
    next(error)
  }
};

module.exports = {
  register,
};
