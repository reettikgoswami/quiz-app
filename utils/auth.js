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

module.exports = {
  generateJwtToken,
}