"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Feedbacks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      testType: {
        type: Sequelize.STRING,
      },
      totalScore: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      categoryScores: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
      strengths: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
      },
      areasForImprovement: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      finalAssessment: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Feedbacks");
  },
};
