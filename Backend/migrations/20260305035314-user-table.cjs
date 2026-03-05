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

    await queryInterface.createTable('CPTUsers', {
      user_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      EmployeeId: {
        type: Sequelize.INTEGER,
        references:{
          model: "Employees",
          key: "EmployeeId"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },

      role_id: {
        type: Sequelize.INTEGER,
        references:{
          model: "CPTRoles",
          key: "role_id"  
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('CPTUsers');
  }
};
