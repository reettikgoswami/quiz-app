var mongoose = require("mongoose");

// utils imports
var utils = require("../utils/quizUtil");

// Database imports
var Quiz = require("../model/quiz");
var Question = require("../model/question");

var createQuiz = async (req, res, next) => {
  try {
    var quiz = new Quiz();

    if (!req.body.questions) {
      req.body.questions = [];
    }
    if (!req.body.title) {
      return res.status(400).json({ mesasge: "Title is empty" });
    }

    var { questions, title } = req.body;
    quiz.title = title;
    quiz.authorID = "12345676543";

    // store all the valid questions
    var validQuestions = [];

    questions.forEach((question) => {
      if (utils.isValidQuestion(question)) {
        question.quizID = quiz._id;
        question.author = quiz.authorID;
        validQuestions.push(question);
      }
    });

    // create questions
    var createdQuestions = await Question.insertMany(validQuestions);

    var questionIDs = createdQuestions.map((question) => question._id);

    quiz.questions = questionIDs;

    // create quiz
    var createdQuiz = await quiz.save();
    res.status(200).send(createdQuiz);
  } catch (error) {
    next(error);
  }
};

var getQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.id; // id = 5ed8970c2370324b8994145b
    var quiz = await Quiz.findById(quizId)
      .populate({
        path: "questions",
        model : "Question"
      })
      .exec();

    if (!quiz) {
      res.status(200).send({mesasge : "Quiz not found"});
    }

    res.status(200).send(quiz);
  } catch (error) {
    next(error);
  }
};

var updateQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    let { questions, title } = req.body;

    for (let i = 0; i < questions.length; i++) {
      let updatequestion = await Question.findByIdAndUpdate(
        questions[i]._id,
        questions[i],
        { new: true }
      ).exec();
    }

    let updatedQuizObject = {
      title,
    };

    let quiz = await Quiz.findByIdAndUpdate(quizId, updatedQuizObject, {
      new: true,
    });
    res.status(200).send(quiz);
  } catch (error) {
    next(error)
  }
};

var deleteQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.id; 
    let quiz = await Quiz.findById(quizId);

    if (!quiz) {
      res.status(200).send({mesasge : "Quiz not found"});
    }

    let { questions } = quiz;

    let deletedQuestionsStatus = await Question.deleteMany({ _id :{ $in : questions } })
    let deletedQuizStatus = await Quiz.findByIdAndDelete(quizId);
    
     res.status(200).send({ mesasge : "Deleted succesfully "});
     
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  createQuiz,
  getQuiz,
  updateQuiz,
  deleteQuiz,
};
