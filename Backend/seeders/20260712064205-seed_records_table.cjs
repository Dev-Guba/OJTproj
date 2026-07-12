'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    const now = new Date();

    const employees = await queryInterface.sequelize.query(
      `
      SELECT 
        EmployeeId,
        FirstName,
        LastName,
        SameDeptCode
      FROM Employees
      `,
      {
        type: Sequelize.QueryTypes.SELECT
      }
    );


    const articles = await queryInterface.sequelize.query(
      `
      SELECT 
        ArticleId,
        article
      FROM Articles
      `,
      {
        type: Sequelize.QueryTypes.SELECT
      }
    );


    const getEmployee = (id) => {
      return employees.find(
        emp => emp.EmployeeId === id
      );
    };


    const getArticle = (id) => {
      return articles.find(
        item => item.ArticleId === id
      );
    };


    await queryInterface.bulkInsert(
      'ICTORecords',
      [

        {
          employee_id: 1,
          article_id: getArticle(1).ArticleId,

          accountableOfficer:
            `${getEmployee(1).FirstName} ${getEmployee(1).LastName}`,

          office:
            getEmployee(1).SameDeptCode,

          status:"ISSUED",

          createdAt:now,
          updatedAt:now
        },


        {
          employee_id: 2,
          article_id: getArticle(2).ArticleId,

          accountableOfficer:
            `${getEmployee(2).FirstName} ${getEmployee(2).LastName}`,

          office:
            getEmployee(2).SameDeptCode,

          status:"ISSUED",

          createdAt:now,
          updatedAt:now
        },


        {
          employee_id: 3,
          article_id: getArticle(3).ArticleId,

          accountableOfficer:
            `${getEmployee(3).FirstName} ${getEmployee(3).LastName}`,

          office:
            getEmployee(3).SameDeptCode,

          status:"ISSUED",

          createdAt:now,
          updatedAt:now
        },


        {
          employee_id: 4,
          article_id: getArticle(4).ArticleId,

          accountableOfficer:
            `${getEmployee(4).FirstName} ${getEmployee(4).LastName}`,

          office:
            getEmployee(4).SameDeptCode,

          status:"ISSUED",

          createdAt:now,
          updatedAt:now
        },


        {
          employee_id: 5,
          article_id: getArticle(5).ArticleId,

          accountableOfficer:
            `${getEmployee(5).FirstName} ${getEmployee(5).LastName}`,

          office:
            getEmployee(5).SameDeptCode,

          status:"ISSUED",

          createdAt:now,
          updatedAt:now
        }

      ]
    );

  },


  async down(queryInterface) {
    await queryInterface.bulkDelete(
      'ICTORecords',
      null,
      {}
    );
  }
};