'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Level extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Level.hasMany(models.User, {
        foreignKey: 'currentLevelId',
        as: 'currentLevel'
      });
      Level.hasMany(models.Quiz, {
        foreignKey: 'levelId'
      });
      Level.hasMany(models.DailyQuizSets, { 
        foreignKey: 'levelId' 
      });
    }
  }
  Level.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Level',
  });
  return Level;
};