'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserDailyQuizResult extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserDailyQuizResult.belongsTo(models.User, { 
        foreignKey: 'userId' 
      });
      UserDailyQuizResult.belongsTo(models.DailyQuizSets, { 
        foreignKey: 'dailyQuizSetId' 
      });
      UserDailyQuizResult.belongsTo(models.Feedback, { 
        foreignKey: 'feedbackId' 
      });
    }
  }
  UserDailyQuizResult.init({
    userId: DataTypes.INTEGER,
    dailyQuizSetId: DataTypes.INTEGER,
    score: DataTypes.INTEGER,
    feedbackId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserDailyQuizResult',
  });
  return UserDailyQuizResult;
};