var express = require('express');
var router = express.Router();

var {register} = require("../controller/userController")
router.post('/' , register);

module.exports = router;
