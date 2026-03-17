'use strict';

const PASSWORD_HASH =
  '$2b$10$7QJ9r6F9nC7Jw2u7gkPzEu6o4Ww3K5WlW8XG2V6Yp7yZx3c9K1u8K'; // admin123

const OFFICE_CODES = [
  'ICTO',
  'HR',
  'ACCOUNTING',
  'BUDGET',
  'ENGINEERING',
  'GSO',
  'PESO',
  'TOURISM',
];

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    const employees = [];
    const employeeAccounts = [];
    const adminAccounts = [];

    for (const office of OFFICE_CODES) {
      for (let i = 1; i <= 10; i++) {
        const employeeNo = `${office}_EMP_${i}`;
        const email = `${office.toLowerCase()}_emp_${i}@icto.com`;

        employees.push({
          EmployeeNo: employeeNo,
          LastName: office,
          FirstName: `Employee${i}`,
          Email: email,
          Password: 'dummy123',
          role_id: 3,
          SameDeptCode: office,
          DateFinish: null,
          SeparationType: null,
          createdAt: now,
          updatedAt: now,
        });

        employeeAccounts.push({
          email,
          password: PASSWORD_HASH,
          role_id: 3,
          EmployeeNo: employeeNo,
          SameDeptCode: office,
        });
      }

      if (office !== 'ICTO') {
        adminAccounts.push({
          email: `admin_${office.toLowerCase()}@icto.com`,
          password: PASSWORD_HASH,
          role_id: 2,
          EmployeeNo: null,
          SameDeptCode: office,
        });
      }
    }

    await queryInterface.bulkInsert('Employees', employees, {});
    await queryInterface.bulkInsert('CPTUsers', employeeAccounts, {});
    await queryInterface.bulkInsert('CPTUsers', adminAccounts, {});
  },

  async down(queryInterface) {
    for (const office of OFFICE_CODES) {
      await queryInterface.bulkDelete('CPTUsers', {
        SameDeptCode: office,
        role_id: 3,
      });

      await queryInterface.bulkDelete('Employees', {
        SameDeptCode: office,
      });
    }

    await queryInterface.bulkDelete('CPTUsers', {
      role_id: 2,
      SameDeptCode: [
        'HR',
        'ACCOUNTING',
        'BUDGET',
        'ENGINEERING',
        'GSO',
        'PESO',
        'TOURISM',
      ],
    });
  },
};