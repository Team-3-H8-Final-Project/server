'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING,
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
        allowNull: false,
        type: Sequelize.STRING,
        validate : {
          isEmail: {
            msg: 'Email must be valid'
          },
          notEmpty: {
            msg: 'Email is required'
          },
          notNull: {
            msg: 'Email is required'
          },
        }
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
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
        type: Sequelize.INTEGER,
        references: {
          model: 'Levels',
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
    await queryInterface.dropTable('Users');
  }
};