const express = require('express');
const router = express.Router();
const Controller = require('../controllers/controller')

router.get('/', (req, res) => {
    res.send('Hello World!')
})

router.post('/generate', Controller.generateQuestions);
router.get('/questions', Controller.getQuestionsByLevel);

module.exports = {
    router
} 