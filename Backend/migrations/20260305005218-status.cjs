'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('status', {
      statusId : {
        type : Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      statusCode : {
        type: Sequelize.STRING(50),
      },

      statusDesc : {
        type : Sequelize.STRING(50),
      }
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('status');
  }
};
