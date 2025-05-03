const express = require('express');
const router = express.Router();
const Controller = require('../controllers/controller');
const UserController = require('../controllers/UserController');

router.get('/', (req, res) => {
    res.send('Hello World!')
})

router.post('/login', UserController.login)
router.post('/register', UserController.register)


router.post('/generate', Controller.generateQuestions);
router.get('/questions', Controller.getQuestionsByLevel);

module.exports = {
    router
} 