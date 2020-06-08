var jwt = require("jsonwebtoken");

var generateJwtToken = async (user, next) => {
  try {
    var payload = {
      username: user.username,
      id: user._id,
    };

    var token = await jwt.sign(payload, process.env.SECRET);

    return token;
  } catch (error) {
    next(error);
  }
};

var validateJwtToken = async (req , res , next) => {
  try {
    const token = req.header["authorization"];
    if(token){
        var payload = await jwt.verify(token , process.env.SECRET);
        req.user = {
          ...payload,
          token
        }
       next(); 
    }else{
      res.status(400).json({
        error: "Token required"
      });
    }
    

  } catch (error) {
    res.status(400).json({
      error: "Wrong token "
    });
  }
}




module.exports = {
  generateJwtToken,
  validateJwtToken
}