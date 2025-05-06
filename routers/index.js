const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controller");
const UserController = require("../controllers/UserController");
const authentication = require("../middleware/authentication");
const FeedbackController = require("../controllers/FeedbackController");

router.get("/", (req, res) => {
  res.send("Welcome to ");
});

router.post("/login", UserController.login);
router.post("/register", UserController.register);

router.post("/generate", authentication, Controller.generateGrammar);
router.get("/grammar", authentication, Controller.getQuestionsByLevel);
router.post("/challenge", authentication, Controller.generateChallenge);
router.get("/challenge", authentication, Controller.getChallenges);
router.get("/profile", authentication, UserController.getProfile);
router.post(
  "/feedback/:type",
  authentication,
  FeedbackController.generateFeedback
); //type : conversation | challenge | grammar
router.get("/feedback", authentication, FeedbackController.getFeedback);
router.get("/feedback/:id", authentication, FeedbackController.getFeedbackById);
module.exports = {
  router,
};
