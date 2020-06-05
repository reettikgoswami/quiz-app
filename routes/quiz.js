var express = require('express');

var quizController = require("../controller/quizController");
var router = express.Router();

router.post('/', quizController.createQuiz);

router.get("/:id" , quizController.showQuiz);

router.put("/:id" , quizController.updateQuiz);

router.delete("/:id" , quizController.deleteQuiz);

module.exports = router;
