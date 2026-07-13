'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Backlogs', {

      tracking_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      records_id: {
        type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: "ICTORecords",
          key: "id"
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },

      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "Created"
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }

    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Backlogs');
  }
};