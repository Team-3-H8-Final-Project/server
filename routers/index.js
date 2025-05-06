const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controller");
const UserController = require("../controllers/UserController");
const authentication = require("../middleware/authentication");
const FeedbackController = require("../controllers/FeedbackController");

router.get("/", (req, res) => {
  res.send("Welcome to ");
});

// users
router.post("/login", UserController.login);
router.post("/register", UserController.register);
router.get("/profile", authentication, UserController.getProfile);
router.put("/profile", authentication, UserController.updateProfile);


// grammar
router.post("/generate", authentication, Controller.generateGrammar);
router.get("/grammar", authentication, Controller.getQuestionsByLevel);

// challenge
router.post("/challenge", authentication, Controller.generateChallenge);
router.get("/challenge", authentication, Controller.getChallenges);


router.post("/conversation", authentication, Controller.generateConversation);
router.get("/conversation", authentication, Controller.getConversations);
router.delete(
  "/conversation/:id",
  authentication,
  Controller.deleteConversation
);
router.post(
  "/feedback/:type",
  authentication,
  FeedbackController.generateFeedback
); //type : conversation | challenge | grammar
router.get("/feedback", authentication, FeedbackController.getFeedback);
router.get("/feedback/:id", authentication, FeedbackController.getFeedbackById);
router.delete(
  "/feedback/:id",
  authentication,
  FeedbackController.deleteFeedback
);
module.exports = {
  router,
};
