var mongoose = require("mongoose");

// utils imports
var { isValidQuestion } = require("../utils/quizUtil");

// Database imports
var Quiz = require("../model/quiz");
var Question = require("../model/question");

var createQuestion = async (req, res, next) => {
  try {
    var { quizId, question } = req.body;

    if (!isValidQuestion(question)) {
      return res.status(400).send({ message: "Not a valid question" });
    }
    var newQuestion = new Question({
      quizId: quizId,
      author: "7354763548",
      ...question,
    });
    await Quiz.findByIdAndUpdate(quizId, {
      $push: {
        questions: newQuestion._id,
      },
    });
    await newQuestion.save();
    res.status(200).json(newQuestion);
  } catch (error) {
    next(error);
  }
};

var updateQuestion = async (req, res, next) => {
  try {
    const questionId = req.params.id;
    var { question } = req.body;

    if (!isValidQuestion(question)) {
      return res.status(400).send({ message: "Question not valid" });
    }

    var updateQuestion = await Question.findByIdAndUpdate(
      questionId,
      { ...question },
      { new: true }
    );

    res.status(200).send(updateQuestion);
  } catch (error) {
    next(error);
  }
};

var deleteQuestion = async (req, res, next) => {
  try {
    const questionId = req.params.id;

    var question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).send({ massage: "Question not found" });
    }

    const quizId = question._id;

    await Quiz.findByIdAndUpdate(quizId, {
      $pull: { questions : questionId },
    });

    await Question.findByIdAndDelete(questionId);

    res.status(200).send("massage : Question deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
