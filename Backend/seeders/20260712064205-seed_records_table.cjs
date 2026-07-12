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
        ArticleId
      FROM Articles
      `,
      {
        type: Sequelize.QueryTypes.SELECT
      }
    );


    const getEmployee = (id) =>
      employees.find(emp => emp.EmployeeId === id);


    const getArticle = (id) =>
      articles.find(item => item.ArticleId === id);



    await queryInterface.bulkInsert(
      "ICTORecords",
      [

        {
          employee_id: 1,
          article_id: getArticle(1).ArticleId,

          areMeNo: "ARE-0001",

          office: getEmployee(1).SameDeptCode,

          status: "ISSUED",

          issuedDate: now,

          returnedDate: null,

          createdAt: now,
          updatedAt: now
        },


        {
          employee_id: 2,
          article_id: getArticle(2).ArticleId,

          areMeNo: "ARE-0002",

          office: getEmployee(2).SameDeptCode,

          status: "ISSUED",

          issuedDate: now,

          returnedDate: null,

          createdAt: now,
          updatedAt: now
        },


        {
          employee_id: 3,
          article_id: getArticle(3).ArticleId,

          areMeNo: "ARE-0003",

          office: getEmployee(3).SameDeptCode,

          status: "ISSUED",

          issuedDate: now,

          returnedDate: null,

          createdAt: now,
          updatedAt: now
        },


        {
          employee_id: 4,
          article_id: getArticle(4).ArticleId,

          areMeNo: "ARE-0004",

          office: getEmployee(4).SameDeptCode,

          status: "ISSUED",

          issuedDate: now,

          returnedDate: null,

          createdAt: now,
          updatedAt: now
        },


        {
          employee_id: 5,
          article_id: getArticle(5).ArticleId,

          areMeNo: "ARE-0005",

          office: getEmployee(5).SameDeptCode,

          status: "ISSUED",

          issuedDate: now,

          returnedDate: null,

          createdAt: now,
          updatedAt: now
        }

      ]
    );

  },


  async down(queryInterface) {

    await queryInterface.bulkDelete(
      "ICTORecords",
      null,
      {}
    );

  }

};