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

router.post('/generate', authentication, Controller.generateQuestions);
router.get('/questions', authentication, Controller.getQuestionsByLevel);
router.get('/profile', authentication, UserController.getProfile);
module.exports = {
    router
} 