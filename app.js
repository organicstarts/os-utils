import bodyParser from "body-parser";
import express from "express";
require("./db/mongoose");
const cors = require("cors");
const app = express();
const router = express.Router();
const corsOption = {
  credential: true
};
const questionRoute = require("./routes/QuestionAPI/question");
const answerRoute = require("./routes/AnswerAPI/answer");

app.use(cors(corsOption));
app.all("/*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(express.static(`${__dirname}/public`));
console.log(`${__dirname}/public`)
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(router);
app.use(questionRoute);
app.use(answerRoute);

module.exports = app;
