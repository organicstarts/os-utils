const router = require("express").Router();
const Answer = require("../../models/answer");
const Question = require("../../models/question");
const auth = require("../../middleware/auth");

/*-------------------------------------------------------------------
                            POST REQUEST                            
---------------------------------------------------------------------*/
router.post("/answer", async (req, res) => {
  let mapKey = `thumbVote.${req.body.email.replace(/[^\w\s]/g, "")}`;
  const answer = new Answer({
    content: req.body.content,
    questionID: req.body.questionID,
    name: req.body.name,
    email: req.body.email,
    [mapKey]: 0
  });
  try {
    await answer.save();
    res.status(201).send({ answer });
  } catch (e) {
    res.status(400).send(e);
  }
});

/*-------------------------------------------------------------------
                            GET REQUEST                            
---------------------------------------------------------------------*/
router.get("/answer/single/:id", async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      throw new Error();
    }
    res.send(answer);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/answer/all/:id", async (req, res) => {
  const match = {};
  const sort = {};
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    const question = await Question.findById({ _id: req.params.id });

    await question
      .populate({
        path: "answers",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort
        }
      })
      .execPopulate();
    res.send(question.answers);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/answer/count", async (req, res) => {
  try {
    const answer = await Answer.find().countDocuments();
    res.send({ answer });
  } catch (e) {
    res.status(500).send();
  }
});

/*-------------------------------------------------------------------
                            PATCH REQUEST                            
---------------------------------------------------------------------*/
router.patch("/answer/:id", async (req, res) => {
  //   const updates = Object.keys(req.body);
  //   const allowedUpdates = ["content"];
  //   const isValidOperation = updates.every(update =>
  //     allowedUpdates.includes(update)
  //   );
  //   if (!isValidOperation) {
  //     return res.status(400).send({ error: "Invalid updates!" });
  //   }

  try {
    const answer = await Answer.findOne({
      _id: req.params.id,
      email: req.body.email
    });

    if (!answer) {
      return res.status(404).send();
    }

    answer.content = req.body.content;
    // updates.forEach(update => (answer[update] = req.body[update]));
    await answer.save();
    res.send(answer);
  } catch (e) {
    res.status(400).send(e);
  }
});

/*-------------------------------------------------------------------
                            DELETE REQUEST                            
---------------------------------------------------------------------*/
router.delete("/answer/:id", auth, async (req, res) => {
  try {
    const answer = await Answer.findOneAndDelete({
      _id: req.params.id
    });

    if (!answer) {
      res.status(404).send();
    }

    res.send(answer);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
