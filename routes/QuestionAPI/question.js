const router = require("express").Router();
const Question = require("../../models/question");
const auth = require("../../middleware/auth");

const profanities = require("google-profanity-words");
/*-------------------------------------------------------------------
                            POST REQUEST                            
---------------------------------------------------------------------*/
router.post("/question", async (req, res) => {
  let reg = new RegExp(profanities.list().join("|"), "gi");
  const qContent = req.body.content.replace(reg, "****");
  let mapKey = `thumbVote.${req.body.email.replace(/[^\w\s]/g, "")}`;

  const question = new Question({
    content:
      qContent.charAt(qContent.length - 1) === "?" ? qContent : qContent + "?",
    productID: req.body.productID,
    name: req.body.name,
    email: req.body.email,
    [mapKey]: 0
  });
  try {
    await question.save();
    res.status(201).send({ question });
  } catch (e) {
    res.status(400).send(e);
  }
});

/*-------------------------------------------------------------------
                            GET REQUEST                            
---------------------------------------------------------------------*/
//Get single question using objectID
router.get("/question/single/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const question = await Question.findById(id);
    if (!question) {
      throw new Error();
    }
    res.send(question);
  } catch (e) {
    res.status(404).send();
  }
});

//Get Questions based on product id + query limit/skip page
router.get("/question/all/:productID", async (req, res) => {
  const id = req.params.productID;
  const limit = req.query.limit ? parseInt(req.query.limit) : 5;
  const skip = req.query.skip ? parseInt(limit * req.query.skip) : 0;
  try {
    const questions = await Question.find({ productID: id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    if (!questions.length) {
      res.status(401).send();
    }
    const questionsObj = {
      questions: questions,
      count: questions.length
    };
    res.status(200).send(questionsObj);
  } catch (e) {
    res.status(500).send();
  }
});

/*-------------------------------------------------------------------
                            UPDATE REQUEST                            
---------------------------------------------------------------------*/
router.patch("/question/vote", async (req, res) => {
  let number = parseInt(req.body.vote);
  let mapKey = req.body.email.replace(/[^\w\s]/g, "");
  try {
    const question = await Question.findById(req.body.id);
    if (!question) {
      return res.status(404).send();
    }
    if (question.thumbVote.get(mapKey)) {
      if (number === question.thumbVote.get(mapKey)) {
        question.thumbVote.set(mapKey, 0);
        if (number === 1) question.points -= 1;
        if (number === 2) question.points += 1;
      } else if (number === 1) {
        question.thumbVote.set(mapKey, number);
        question.points += 1;
      } else if (number === 2) {
        question.thumbVote.set(mapKey, number);
        question.points -= 1;
      }
    } else {
      question.thumbVote.set(mapKey, number);
      if (number === 1) question.points += 1;
      if (number === 2) question.points -= 1;
    }
    await question.save();

    res.status(200).send(question);
  } catch (e) {
    res.status(500).send();
  }
});

/*-------------------------------------------------------------------
                            DELETE REQUEST                            
---------------------------------------------------------------------*/
router.delete("/question/:id", auth, async (req, res) => {
  if (req.user !== "admin") {
    res.status(400).send({ msg: "Not Authorized to Delete" });
  }

  try {
    const question = await Question.findOneAndDelete({
      _id: req.params.id
    });

    if (!question) {
      res.status(404).send();
    }

    res.send(question);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
