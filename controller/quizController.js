var mongoose = require("mongoose");

// utils imports
var utils =  require("../utils/quizUtil");  

// Database imports
var Quiz = require("../model/quiz");
var Question = require("../model/question");

var createQuiz = async (req, res, next) => {
  try {
    var quiz = new Quiz();
    var { questions, title } = req.body;
    quiz.title = title;
    quiz.authorID = "12345676543";

    // store all the valid questions
    var validQuestions = [];

    questions.forEach(question => {
      if(utils.isValidQuestion(question)){
        question.quizID = quiz._id;
        question.author = quiz.authorID;
        validQuestions.push(question)
      }
    })
    
    // create questions
    var createdQuestions = await Question.insertMany(validQuestions);
    
    var questionIDs = createdQuestions.map(question => question._id);
   
    quiz.questions = questionIDs;

    // create quiz
    var createdQuiz = await quiz.save();
    res.status(200).send(createdQuiz);

  } catch (error) {
    console.error(error);
  }
};



var getQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    var quiz = await Quiz.findById(quizId)
      .populate({
        path: "questions",
      })
      .exec();

    res.status(200).send(quiz);
  } catch (error) {
    next(error)
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
    console.error(error);
  }
};

var deleteQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    let quiz = await Quiz.findById(quizId);
    let { questions } = quiz;
    for (let i = 0; i < questions.length; i++) {
      await Question.findByIdAndRemove(questions[0]._id);
    }
    await Quiz.findByIdAndRemove(quizId);
    res.status(200).send({ message: "deleted" });
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
