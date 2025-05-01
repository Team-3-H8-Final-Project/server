'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DailyQuizSets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DailyQuizSets.belongsTo(models.Level, { 
        foreignKey: 'levelId' 
      });
      DailyQuizSets.hasMany(models.DailyQuizMapping, { 
        foreignKey: 'dailyQuizSetId' 
      });
      DailyQuizSets.hasMany(models.UserDailyQuizResult, { 
        foreignKey: 'dailyQuizSetId' 
      });
    }
  }
  DailyQuizSets.init({
    levelId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Levels',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'DailyQuizSets',
  });
  return DailyQuizSets;
};