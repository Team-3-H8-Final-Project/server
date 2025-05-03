'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Level, {
        foreignKey: 'currentLevelId',
        as: 'currentLevel'
      });
      User.hasMany(models.UserQuiz, {
        foreignKey: 'userId'
      });
      User.hasMany(models.UserDailyQuizResult, {
        foreignKey: 'userId'
      });
    }
  }
  User.init({
    username: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: {
        msg: "Username must be unique"
      },
      validate: {
        notEmpty: {
          msg: 'Username is required'
        },
        notNull: {
          msg: 'Username is required'
        },
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Email must be unique"
      },
      validate: {
        isEmail: {
          msg: "Invalid email format"
        },
        notNull: {
          msg: "Email is required"
        },
        notEmpty: {
          msg: "Email is required"
        }
      }
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Password is required'
        },
        notNull: {
          msg: 'Password is required'
        },
        min: {
          args: 6,
          msg: 'Password must be at least 6 characters long'
        }
      }
    },
    currentLevelId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Levels',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'User'
  });
  return User;
};