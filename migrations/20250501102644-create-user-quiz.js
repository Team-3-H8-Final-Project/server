'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserQuizzes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      quizId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Quizzes',
          key: 'id'
        }
      },
      userAnswer: {
        type: Sequelize.STRING
      },
      isCorrect: {
        type: Sequelize.BOOLEAN
      },
      feedbackId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Feedbacks',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserQuizzes');
  }
};