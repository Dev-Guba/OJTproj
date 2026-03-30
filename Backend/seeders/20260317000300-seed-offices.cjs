'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('Offices', [
      {
        code: 'ICTO',
        name: 'Information and Communications Technology Office',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        code: 'HR',
        name: 'Human Resources',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        code: 'ACCOUNTING',
        name: 'Accounting Office',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        code: 'BUDGET',
        name: 'Budget Office',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        code: 'ENGINEERING',
        name: 'Engineering Office',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        code: 'GSO',
        name: 'General Services Office',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        code: 'PESO',
        name: 'Public Employment Service Office',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        code: 'TOURISM',
        name: 'Tourism Office',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Offices', null, {});
  },
};