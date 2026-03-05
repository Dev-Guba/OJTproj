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

    await queryInterface.bulkInsert('status', [
      {
        statusCode: '0001',
        statusDesc: 'PERMANENT'
      },
      {
        statusCode: '0002',
        statusDesc: 'ELECTED OFFICIALS'
      },
      {
        statusCode: '0003',
        statusDesc: 'CASUAL'
      },
      {
        statusCode: '0004',
        statusDesc: 'CO-TERMINOUS'
      },
      {
        statusCode: '0005',
        statusDesc: 'JOB ORDER'
      },
      {
        statusCode: '0006',
        statusDesc: 'CONTRACT OF SERVICE'
      },
      {
        statusCode: '0041',
        statusDesc: 'AWOL'
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('status',{
      statusCode: ['0001','0002','0003','0004','0005','0006','0041'],
    }, {});
  }
};
