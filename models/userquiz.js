'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserQuiz extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserQuizAttempt.belongsTo(models.User, { 
        foreignKey: 'userId' 
      });
      UserQuizAttempt.belongsTo(models.Quiz, { 
        foreignKey: 'quizId' 
      });
      UserQuizAttempt.belongsTo(models.Feedback, { 
        foreignKey: 'feedbackId' 
      });
    }
  }
  UserQuiz.init({
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    quizId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Quizzes',
        key: 'id'
      }
    },
    userAnswer: DataTypes.STRING,
    isCorrect: DataTypes.BOOLEAN,
    feedbackId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Feedbacks',
        key: 'id'
      }
    },
  }, {
    sequelize,
    modelName: 'UserQuiz',
  });
  return UserQuiz;
};