import bodyParser from "body-parser";
import express from "express";
const cors = require("cors");
const app = express();
const router = express.Router();
const corsOption = {
  credential: true
};
app.use(cors(corsOption));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(router);

module.exports = app;
