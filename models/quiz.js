'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Quiz extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Quiz.belongsTo(models.Level, {
        foreignKey: 'levelId'
      });
      Quiz.belongsTo(models.QuizCategory, {
        foreignKey: 'categoryId'
      });
      Quiz.hasMany(models.UserQuiz, { 
        foreignKey: 'quizId' 
      });
      Quiz.hasMany(models.DailyQuizMapping, { 
        foreignKey: 'quizId' 
      });

    }
  }
  Quiz.init({
    question: DataTypes.STRING,
    options: DataTypes.JSONB,
    correctAnswer: DataTypes.STRING,
    levelId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Levels',
        key: 'id'
      }
    },
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'QuizCategories',
        key: 'id'
      }
    },
  }, {
    sequelize,
    modelName: 'Quiz',
  });
  return Quiz;
};