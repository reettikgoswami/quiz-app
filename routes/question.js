var express = require('express');

var questionController = require("../controller/questionController");
var router = express.Router();

router.post('/', questionController.createQuestion);

router.put("/:id", questionController.updateQuestion);

router.delete("/:id" , questionController.deleteQuestion);

module.exports = router;
