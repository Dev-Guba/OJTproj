'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Backlogs", {

      tracking_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      records_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "ICTORecords",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      article_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Articles",
          key: "ArticleId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      previous_employee_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Employees",
          key: "EmployeeId",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      new_employee_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Employees",
          key: "EmployeeId",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      performed_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Employees",
          key: "EmployeeId",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      action: {
        type: Sequelize.ENUM(
          "CREATED",
          "TRANSFERRED",
          "RETURNED",
          "UPDATED",
          "DELETED"
        ),
        allowNull: false,
      },

      remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Backlogs");
  },
};