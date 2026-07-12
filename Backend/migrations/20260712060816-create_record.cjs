'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('ICTORecords', {

      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: "Employees",
          key: "EmployeeId"
        },

        onUpdate: "CASCADE",
        onDelete: "NO ACTION"
      },

      article_id: {
        type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: "Articles",
          key: "ArticleId"
        },

        onUpdate: "CASCADE",
        onDelete: "NO ACTION"
      },


      areMeNo: {
        type: Sequelize.STRING,
        allowNull: true
      },


      office: {
        type: Sequelize.STRING,
        allowNull: true
      },


      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "ISSUED"
      },


      issuedDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },


      returnedDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },


      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },


      updatedAt: {
        type: Sequelize.DATE,
        allowNull:false
      }

    });

  },


  async down(queryInterface){
    await queryInterface.dropTable('ICTORecords');
  }
};