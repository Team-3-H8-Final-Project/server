'use strict';
const { hashPassword } = require('../helpers/bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    // seeder for user
    await queryInterface.bulkInsert('Users', [
      {
        "name": "user1",
        "email": "user1@example.com",
        "username": "user1",
        "password": await hashPassword("12345678"),
        "createdAt": new Date(),
        "updatedAt": new Date()
      }
    ])

    // seeder for challenge topic
    await queryInterface.bulkInsert('ChallengeTopics', [
      {
        name: 'Food and Drinks',
        imgUrl: 'https://i.ibb.co.com/Q7MsVJNX/Chef-bro.png',
        description: 'Learn how to communicate about food and drinks in English.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Travel and Tourism',
        imgUrl: 'https://i.ibb.co.com/Pvt50Byv/Trip-bro.png',
        description: 'Learn how to communicate about travel and tourism in English.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sports and Fitness',
        imgUrl: 'https://i.ibb.co.com/RTj93yzy/Jogging-bro.png',
        description: 'Learn how to communicate about sports and fitness in English.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  // seeder for challenges


  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
