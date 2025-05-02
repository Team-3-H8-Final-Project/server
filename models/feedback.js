'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Feedback.hasMany(models.UserQuiz, { foreignKey: 'feedbackId' });
      Feedback.hasMany(models.UserDailyQuizResult, { foreignKey: 'feedbackId' });
    }
  }
  Feedback.init({
    type: DataTypes.STRING,
    content: DataTypes.STRING,
    score: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Feedback',
  });
  return Feedback;
};