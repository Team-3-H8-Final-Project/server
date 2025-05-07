const { ChallengeTopic } = require('../models');
class ChallengeTopicController {
    static async index(req, res, next) {
        try {
            const challengeTopics = await ChallengeTopic.findAll();
            res.status(200).json(challengeTopics);
        } catch (error) {
            next(error);
        }
    }
}
module.exports = ChallengeTopicController;