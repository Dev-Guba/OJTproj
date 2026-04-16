'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ICTORecords', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true, 
        primaryKey: true,
      },

      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Employees",
          key: "EmployeeId",
        },
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
      },

      article: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      propNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      dateAcquired: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      unit: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      unitValue: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: true,
      },

      balQty: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: true,
      },

      balValue: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: true,
      },

      areMeNo: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      office: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ICTORecords');
  },
};