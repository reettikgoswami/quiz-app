var express = require('express');
var router = express.Router();

var {register , login} = require("../controller/userController")
router.post('/users' , register);
router.post("/users/login" , login);


module.exports = router;
