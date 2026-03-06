'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   
    await queryInterface.bulkInsert('CPTUsers', [
      {
        EmployeeId: 1,
        role_id: 1
      },
      {
        EmployeeId: 2,
        role_id: 2
      },
      {
        EmployeeId: 3,
        role_id: 3
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('CPTUsers', {
      EmployeeId: [1,2,3]
    }, {})
  }
};
