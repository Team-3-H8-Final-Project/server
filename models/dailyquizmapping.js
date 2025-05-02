'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DailyQuizMapping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DailyQuizMapping.belongsTo(models.DailyQuizSets, { 
        foreignKey: 'dailyQuizSetId' 
      });
      DailyQuizMapping.belongsTo(models.Quiz, { 
        foreignKey: 'quizId' 
      });
    }
  }
  DailyQuizMapping.init({
    dailyQuizSetId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'DailyQuizSets',
        key : 'id'
      }
    },
    quizId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Quizzes',
        key: 'id'
      }
    },
    orderNumber: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DailyQuizMapping',
  });
  return DailyQuizMapping;
};