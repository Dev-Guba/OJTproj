'use strict';

module.exports = {

  async up(queryInterface, Sequelize) {

    const now = new Date();

    const admin = await queryInterface.sequelize.query(
      `
      SELECT EmployeeId
      FROM Employees
      WHERE EmployeeNo = 'EMP001'
      `,
      {
        type: Sequelize.QueryTypes.SELECT
      }
    );


    const performedBy = admin[0].EmployeeId;


    const areMeNos = [
      "ARE-0001",
      "ARE-0002",
      "ARE-0003",
      "ARE-0004",
      "ARE-0005"
    ];


    const records = await queryInterface.sequelize.query(
      `
      SELECT 
        id,
        employee_id,
        article_id,
        areMeNo
      FROM ICTORecords
      WHERE areMeNo IN (:areMeNos)
      `,
      {
        replacements: { areMeNos },
        type: Sequelize.QueryTypes.SELECT
      }
    );


    await queryInterface.bulkInsert(
      "Backlogs",

      records.map((record) => ({
        records_id: record.id,
        article_id: record.article_id,
        // No previous owner because this is creation
        previous_employee_id: null,
        // Employee receiving the asset
        new_employee_id: record.employee_id,
        // Admin who created the transaction
        performed_by: performedBy,
        action: "CREATED",
        remarks: "Initial asset assignment",
        createdAt: now,
        updatedAt: now
      }))
    );

  },


  async down(queryInterface) {

    await queryInterface.bulkDelete(
      "Backlogs",
      null,
      {}
    );

  }

};