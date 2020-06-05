var mongoose = require("mongoose");

// utils imports
var utils = require("../utils/quizUtil");

// Database imports
var Quiz = require("../model/quiz");
var Question = require("../model/question");

var createQuiz = async (req, res, next) => {
  try {
    var quiz = new Quiz();

    if (!req.body.quiz.questions) {
      req.body.quiz.questions = [];
    }

    if (!req.body.quiz.title) {
      return res.status(404).json({ mesasge: "Title is empty" });
    }

    var { questions, title } = req.body.quiz;
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

var showQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    var quiz = await Quiz.findById(quizId)
      .populate({
        path: "questions",
        model: "Question",
      })

    if (!quiz) {
    return res.status(404).send({ mesasge: "Quiz not found" });
    }

    res.status(200).send(quiz);
  } catch (error) {
    next(error);
  }
};

var updateQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.id;
     
    var quiz = await Quiz.findById(quizId);

    if(!quiz){
      return  res.status(404).send({massage : "Quiz not found"});
    }

    var { title } =  res.body.quiz;
    
    if(!title){
       return res.status(200).send({massage : "Nothing to update"})
     }
     quiz.title = title; 

     quiz.save();
     
     return res.status(200).send({massage : "Quiz title updated"}); 

  } catch (error) {
    next(error);
  }
};

var deleteQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    let quiz = await Quiz.findById(quizId);

    if (!quiz) {
     return res.status(404).send({ mesasge: "Quiz not found" });
    }

    let { questions } = quiz;

    await Question.deleteMany({
      _id: { $in: questions },
    });
    await Quiz.findByIdAndDelete(quizId);

    res.status(200).send({ mesasge: "Deleted succesfully " });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createQuiz,
  showQuiz,
  updateQuiz,
  deleteQuiz,
};
