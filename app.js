var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
require('dotenv').config()

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var quizRouter = require("./routes/quiz");
var questionRoute = require("./routes/question");

mongoose.connect(
  "mongodb://localhost:27017/quiz",
  { useNewUrlParser: true , useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Database connected");
    }
  }
);

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/quiz" , quizRouter);
app.use("/questions" , questionRoute);

module.exports = app;
