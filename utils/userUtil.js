
var isValidUser = (user)=>{
  var massage = {
    status : true
  }
  if(!user.name || user.name.length<4 || user.name.length>20){
    massage.status = false;
    massage.name = "Name requied and it should be 4-20 character "
  }
  if(!user.username || user.username.length<4 || user.username.length>20){
    massage.status = false;
    massage.username = "Username requied and it should be 5-15 character "
  }
  if(!user.email || !user.email.includes("@") ){
    massage.status = false;
    massage.email = "invalid email"
  }
  if(!user.password || user.password.length<6 || user.password.length>20){
    massage.status = false;
    massage.password = "Password requied and it should be 6-20 character"
  }
  
return massage;
}

module.exports = {
  isValidUser
}