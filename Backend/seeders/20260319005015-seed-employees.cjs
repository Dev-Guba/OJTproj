'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const hashedPassword =
      '$2b$10$Fdc3JrH4DEPO1fr9x9yY..h1xSGebjG2EejHKCCDZup4YXDEIGpG6';

    const adminHashPassword =
      '$2b$10$ZjCtWI1H9rsYt3TU9FpEdubgD0AJ9Drh3KifACoEq2JpQ.XswuYf2';
      const officeMap = [
  { office_id: 1, code: "ICTO" },
  { office_id: 2, code: "HR" },
  { office_id: 3, code: "ACCOUNTING" },
  { office_id: 4, code: "BUDGET" },
  { office_id: 5, code: "ENGINEERING" },
  { office_id: 6, code: "GSO" },
  { office_id: 7, code: "PESO" },
  { office_id: 8, code: "TOURISM" },
];
    const employees = [
      // ✅ YOUR EXISTING DATA (unchanged)
      
      {

        EmployeeNo: 'EMP001',
        statusId: 1,
        role_id: 1,
        office_id: 1,
        LastName: 'Cruz',
        FirstName: 'Juan',
        SameDeptCode: officeMap.find((o) => o.office_id === 1)?.code || null,
        Position: 'HR Officer',
        Email: 'juan.cruz@icto.com',
        Gender: 'M',
        CivilStatus: 'Married',
        CityTown: 'Cebu City',
        Province: 'Cebu',
        CellNo: '09111111111',
        MonthlyRate: 25000,
        Password: hashedPassword,
        createdAt: now,
        updatedAt: now,
      },

      // ADMINS
      {
        EmployeeNo: 'EMP002',
        statusId: 1,
        role_id: 2,
        office_id: 2,
        LastName: 'Reyes',
        FirstName: 'Maria',
        SameDeptCode: officeMap.find((o) => o.office_id === 2)?.code || null,
        Position: 'Accountant',
        Email: 'maria.reyes@icto.com',
        Gender: 'F',
        CivilStatus: 'Single',
        Province: 'Cebu',
        CellNo: '09222222222',
        MonthlyRate: 30000,
        Password: adminHashPassword,
        createdAt: now,
        updatedAt: now,
      },
      {
        EmployeeNo: 'EMP003',
        statusId: 1,
        role_id: 2,
        office_id: 3,
        LastName: 'Garcia',
        FirstName: 'Pedro',
        SameDeptCode: officeMap.find((o) => o.office_id === 3)?.code || null,
        Position: 'Budget Analyst',
        Email: 'pedro.garcia@icto.com',
        Gender: 'M',
        CivilStatus: 'Single',
        CellNo: '09333333333',
        MonthlyRate: 28000,
        Password: adminHashPassword,
        createdAt: now,
        updatedAt: now,
      },
      {
        EmployeeNo: 'EMP004',
        statusId: 1,
        role_id: 2,
        office_id: 4,
        LastName: 'Torres',
        FirstName: 'Ana',
        SameDeptCode: officeMap.find((o) => o.office_id === 4)?.code || null,
        Position: 'Engineer',
        Email: 'ana.torres@icto.com',
        Gender: 'F',
        CivilStatus: 'Single',
        PhoneNo: '0321234567',
        MonthlyRate: 35000,
        Password: adminHashPassword,
        createdAt: now,
        updatedAt: now,
      },
      {
        EmployeeNo: 'EMP005',
        statusId: 1,
        role_id: 2,
        office_id: 5,
        LastName: 'Flores',
        FirstName: 'Mark',
        SameDeptCode: officeMap.find((o) => o.office_id === 5)?.code || null,
        Position: 'GSO Staff',
        Email: 'mark.flores@icto.com',
        Gender: 'M',
        CivilStatus: 'Single',
        CellNo: '09555555555',
        MonthlyRate: 22000,
        Password: adminHashPassword,
        createdAt: now,
        updatedAt: now,
      },
      {
        EmployeeNo: 'EMP006',
        statusId: 1,
        role_id: 2,
        office_id: 6,
        LastName: 'Navarro',
        FirstName: 'Liza',
        SameDeptCode: officeMap.find((o) => o.office_id === 6)?.code || null,
        Position: 'PESO Officer',
        Email: 'liza.navarro@icto.com',
        Gender: 'F',
        CivilStatus: 'Married',
        MonthlyRate: 26000,
        Password: adminHashPassword,
        createdAt: now,
        updatedAt: now,
      },
      {
        EmployeeNo: 'EMP007',
        statusId: 1,
        role_id: 2,
        office_id: 7,
        LastName: 'Santos',
        FirstName: 'Carlo',
        SameDeptCode: officeMap.find((o) => o.office_id === 7)?.code || null,
        Position: 'Tourism Officer',
        Email: 'carlo.santos@icto.com',
        Gender: 'M',
        CivilStatus: 'Single',
        CellNo: '09777777777',
        MonthlyRate: 27000,
        Password: adminHashPassword,
        createdAt: now,
        updatedAt: now,
      },
    ];

    // 🔥 AUTO-GENERATE USERS (role_id = 3)
    let empCounter = 100;

    const officeIds = [1, 2, 4, 5, 6, 7, 8];


    officeIds.forEach((officeId) => {
      for (let i = 1; i <= 3; i++) {
        employees.push({
          EmployeeNo: `EMP${empCounter++}`,
          statusId: 1,
          role_id: 3, // 👈 USERS
          office_id: officeId,

          LastName: `User${i}`,
          FirstName: `User${officeId}`,

          SameDeptCode: officeMap.find((o) => o.office_id === officeId)?.code || null,

          Position: 'Employee',
          Email: `user${i}_office${officeId}@test.com`,

          Gender: 'M',
          CivilStatus: 'Single',

          CellNo: `09${Math.floor(100000000 + Math.random() * 900000000)}`,

          MonthlyRate: 18000,

          Password: hashedPassword,

          createdAt: now,
          updatedAt: now,
        });
      }
    });

    await queryInterface.bulkInsert('Employees', employees, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Employees', null, {});
  },
};