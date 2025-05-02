'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DailyQuizMappings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dailyQuizSetId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'DailyQuizSets',
          key : 'id'
        }
      },
      quizId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Quizzes',
          key: 'id'
        }
      },
      orderNumber: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('DailyQuizMappings');
  }
};