'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('Offices', [
      {
        code: 'ICTO',
        name: 'Information and Communications Technology Office',
        description: 'Handles all IT-related matters and services for the organization.',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        code: 'HR',
        name: 'Human Resources',
        description: 'Manages employee relations, recruitment, and organizational development.',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        code: 'ACCOUNTING',
        name: 'Accounting Office',
        description: 'Handles all accounting and financial matters for the organization.',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        code: 'BUDGET',
        name: 'Budget Office',
        description: 'Manages the organization\'s budgeting and financial planning.',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        code: 'ENGINEERING',
        name: 'Engineering Office',
        description: 'Responsible for engineering design, development, and maintenance.',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        code: 'GSO',
        name: 'General Services Office',
        description: 'Provides general services and support to the organization.',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        code: 'PESO',
        name: 'Public Employment Service Office',
        description: 'Provides employment services and support to the organization.',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        code: 'TOURISM',
        name: 'Tourism Office',
        description: 'Promotes and supports the tourism industry in the organization.',
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