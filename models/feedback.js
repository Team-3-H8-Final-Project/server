"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    static associate(models) {
      Feedback.hasMany(models.UserQuiz, { foreignKey: "feedbackId" });
      Feedback.hasMany(models.UserDailyQuizResult, {
        foreignKey: "feedbackId",
      });
      Feedback.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Feedback.init(
    {
      testType: {
        type: DataTypes.STRING,
      },
      totalScore: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      categoryScores: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
      strengths: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      areasForImprovement: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      finalAssessment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Feedback",
    }
  );

  return Feedback;
};
