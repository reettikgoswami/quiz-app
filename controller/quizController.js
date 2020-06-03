var mongoose = require("mongoose");

var Quiz = require("../model/quiz");
var Question = require("../model/question");

var isQuestionCorrect = (ques) => {
  if (!ques.question) {
    return false;
  }
  if (ques.options.length !== 4 || ques.rightOptions.length < 1) {
    return false;
  }
  return true;
};


var createQuiz = async (req, res, next) => {
  try {
    var quiz = new Quiz();
    var { questions, title } = req.body;
    quiz.title = title;
    quiz.authorID = "12345676543";

    // filter non valid questions
    var questionsArray = questions.filter((question) =>
      isQuestionCorrect(question)
    );

    //  add quizId and authorId into the question
    questionsArray = questionsArray.map((question) => {
      question.quizID = quiz._id;
      question.author = quiz.authorID;
      return question;
    });

    var questionIDs = [];
    // create questions
    var createdQuestion = await Question.create(questionsArray);

    for (let i = 0; i < createdQuestion.length; i++) {
      questionIDs.push(createdQuestion[i]._id);
    }
    quiz.questions = questionIDs;
   
    // create quiz
    var createdQuiz = await (await Quiz.create(quiz)).populate({
      path :  "questions"
    }).execPopulate();

    res.status(200).send(createdQuiz);

  } catch (error) {
    console.error(error);
  }
};


var getQuiz = async (req , res , next) => {
  try {
    const quizId = req.params.id;  // id = 5ed756ff72b45434c0e3343f
    var quiz = await Quiz.findById(quizId).populate({
      path : "questions"
    }).exec() 

    res.status(200).send(quiz);
  } catch (error) {
    console.error(error);
  }
}


var updateQuiz = async (req , res , next) =>{
  try {
    const quizId = req.params.id;
    let {questions , title  } = req.body;

    for(let i=0;i<questions.length;i++){
       let updatequestion  = await Question.findByIdAndUpdate(questions[i]._id , questions[i] , {new : true}).exec();
    }

   let updatedQuizObject = {
      title,
   }

    let quiz = await Quiz.findByIdAndUpdate(quizId , updatedQuizObject , {new: true});
    res.status(200).send(quiz);

  } catch (error) {
    console.error(error);
  }
}


var deleteQuiz = async (req , res , next) =>{
  try {
     const quizId = req.params.id;
      let quiz = await Quiz.findById(quizId);
      let {questions} = quiz
      for(let i=0;i<questions.length;i++){
        await Question.findByIdAndRemove(questions[0].
          _id)
      }
       await Quiz.findByIdAndRemove(quizId); 
       res.status(200).send({message : "deleted"});

  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  createQuiz,
  getQuiz,
  updateQuiz,
  deleteQuiz
};
