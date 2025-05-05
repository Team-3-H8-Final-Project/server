'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Challenges', [
      {
        question: 'What is the capital of France?',
        answer: 'Paris',
        level: 'Pemula',
        options: JSON.stringify(['Paris', 'London', 'Berlin', 'Madrid']),
        theme: 'Geography',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'What is 2 + 2?',
        answer: '4',
        level: 'Pemula',
        options: JSON.stringify(['3', '4', '5', '6']),
        theme: 'Mathematics',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'Who wrote "Hamlet"?',
        answer: 'William Shakespeare',
        level: 'Menengah',
        options: JSON.stringify(['Charles Dickens', 'William Shakespeare', 'Mark Twain', 'Jane Austen']),
        theme: 'Literature',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'What is the chemical symbol for water?',
        answer: 'H2O',
        level: 'Menengah',
        options: JSON.stringify(['H2O', 'O2', 'CO2', 'NaCl']),
        theme: 'Science',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'What is the square root of 144?',
        answer: '12',
        level: 'Lanjutan',
        options: JSON.stringify(['10', '11', '12', '13']),
        theme: 'Mathematics',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },


  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Challenges', null, {});
  },
    
};
