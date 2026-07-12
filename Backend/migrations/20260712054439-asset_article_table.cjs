'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Articles', {
      ArticleId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
        unique: true,
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
        type: Sequelize.DECIMAL(18,2),
        allowNull: true,
      },

      balQty: {
        type: Sequelize.DECIMAL(18,2),
        allowNull: true,
      },

      balValue: {
        type: Sequelize.DECIMAL(18,2),
        allowNull: true,
      },

      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Articles');
  }
};