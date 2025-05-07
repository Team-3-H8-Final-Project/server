const express = require('express');
const router = express.Router();
const Controller = require('../controllers/controller');
const UserController = require('../controllers/UserController');
const authentication = require('../middleware/authentication');

router.get('/', (req, res) => {
    res.send('Welcome to ')
})

router.post('/login', UserController.login)
router.post('/register', UserController.register)

router.post('/generate', authentication, Controller.generateGrammar);
router.get('/grammar', authentication, Controller.getQuestionsByLevel);
router.post('/challenge', authentication, Controller.generateChallenge);
router.get('/challenge', authentication, Controller.getChallenges);
router.get('/conversation', authentication, Controller.generateConversation);
router.get('/profile', authentication, UserController.getProfile);
module.exports = {
    router
} 