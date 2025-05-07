'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChallengeTopic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ChallengeTopic.init({
    name: DataTypes.STRING,
    imgUrl: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ChallengeTopic',
  });
  return ChallengeTopic;
};