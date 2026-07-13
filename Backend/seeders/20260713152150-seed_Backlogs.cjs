'use strict';

module.exports = {

  async up(queryInterface, Sequelize) {

    const now = new Date();

    const areMeNos = ["ARE-0001", "ARE-0002", "ARE-0003", "ARE-0004", "ARE-0005"];

    const records = await queryInterface.sequelize.query(
      `
      SELECT id, areMeNo
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
        status: "Created",
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