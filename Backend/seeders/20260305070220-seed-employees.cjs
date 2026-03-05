'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const saltRounds = 10;
    const password1 = await bcrypt.hash('password123', saltRounds);
    const password2 = await bcrypt.hash('admin456', saltRounds);
    const password3 = await bcrypt.hash('user789', saltRounds);

    await queryInterface.bulkInsert('Employees', [
      {
        EmployeeNo: 'EMP001',
        statusId: 1,
        role_id: 1,

        LastName: 'Dela Cruz',
        FirstName: 'Juan',
        MiddleName: 'Reyes',
        MiddleInitial: 'R',
        SuffixName: null,
        TitleSuffix: null,

        EmploymentStatusCode: 'PERM',
        SalaryFundingCode: 'GEN',
        AppointmentStatusCode: 'REG',
        DateHired: new Date('2020-01-10'),
        DateOfAppointment: new Date('2020-01-10'),

        Category: 'A',
        PayrollTerms: 'M',
        PayrollMode: 'B',
        ConfidentialityLevel: '1',

        GroupCode: 'GRP1',
        Division: 'IT',
        Department: 'Development',
        Section: 'Backend',
        Position: 'Developer',
        OfficialPosition: 'Software Developer',

        MonthlyGrade: 12,
        MonthlyStep: 1,
        RATA: 'YES',

        ADCOM: 1000.00,
        PERA: 2000.00,
        TransAllowance: 500.00,

        MonthlyRate: 35000.00,
        DailyRate: 1200.00,
        RateDivisior: 22,

        Birthday: new Date('1995-05-10'),
        Age: 29,
        BirthPlace: 'Iloilo',
        Gender: 'M',
        CivilStatus: 'Single',
        Citizenship: 'Filipino',

        Height: '170cm',
        Weight: '65kg',

        Email: 'juan.delacruz@example.com',
        Password: password1,
        CellNo: '09123456789',

        StreetNo: '12',
        Village: 'Green Village',
        Barangay: 'So-oc',
        CityTown: 'Arevalo',
        Province: 'Iloilo',
        Region: 6,
        Country: 'Philippines',
        ZipCode: '5000',

        GSISNo: 'GSIS123456',
        PhilHealthNo: 'PH123456',
        PagIbigNo: 'PAG123456',
        TaxIDNo: 'TIN123456',

        WithGSISNo: true,
        WithPagIbigNo: true,
        WithPhilHealthNo: true,
        WithTaxIDNo: true,

        BankCode: 'LANDBANK',
        BankAccountNo: '123456789',

        PolicyNo: 'POL001',
        CostCenter: 'IT-DEV',

        Plantilla: 'Y',
        Eligibility: 'Professional',
        Classification: 'A',
        CareerLevel: 2,

        Detail: 'Seeded employee record',

        IsDeleted: 0,
        lockPDSflag: 0,
        IsDtrExempted: 0,
        RcvSMSLogs: 1,

        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        EmployeeNo: 'EMP002',
        statusId: 1,
        role_id: 2,

        LastName: 'Santos',
        FirstName: 'Maria',
        MiddleName: 'Lopez',
        MiddleInitial: 'L',

        EmploymentStatusCode: 'PERM',
        SalaryFundingCode: 'GEN',
        AppointmentStatusCode: 'REG',

        DateHired: new Date('2021-03-15'),

        Division: 'HR',
        Department: 'Human Resource',
        Position: 'HR Officer',

        MonthlyGrade: 10,
        MonthlyStep: 2,

        MonthlyRate: 28000.00,
        DailyRate: 1000.00,
        RateDivisior: 22,

        Birthday: new Date('1996-07-12'),
        Age: 28,
        BirthPlace: 'Iloilo',
        Gender: 'F',
        CivilStatus: 'Single',
        Citizenship: 'Filipino',

        Email: 'maria.santos@example.com',
        Password: password2,
        CellNo: '09123456788',

        Barangay: 'Molo',
        CityTown: 'Iloilo City',
        Province: 'Iloilo',
        Region: 6,

        WithGSISNo: true,
        WithPagIbigNo: true,
        WithPhilHealthNo: true,
        WithTaxIDNo: true,

        IsDeleted: 0,
        lockPDSflag: 0,
        IsDtrExempted: 0,
        RcvSMSLogs: 1,

        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        EmployeeNo: 'EMP003',
        statusId: 1,
        role_id: 2,

        LastName: 'Garcia',
        FirstName: 'Pedro',
        MiddleName: 'Torres',
        MiddleInitial: 'T',

        EmploymentStatusCode: 'CONTRACT',
        AppointmentStatusCode: 'TEMP',

        DateHired: new Date('2022-08-01'),

        Division: 'Finance',
        Department: 'Accounting',
        Position: 'Accountant',

        MonthlyGrade: 11,
        MonthlyStep: 1,

        MonthlyRate: 30000.00,
        DailyRate: 1100.00,
        RateDivisior: 22,

        Birthday: new Date('1994-02-02'),
        Age: 30,
        BirthPlace: 'Guimaras',
        Gender: 'M',

        Email: 'pedro.garcia@example.com',
        Password: password3,
        CellNo: '09123456787',

        Province: 'Iloilo',
        Region: 6,

        WithGSISNo: true,
        WithPagIbigNo: true,
        WithPhilHealthNo: true,
        WithTaxIDNo: true,

        IsDeleted: 0,
        lockPDSflag: 0,
        IsDtrExempted: 0,
        RcvSMSLogs: 1,

        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Employees', {
      EmployeeNo: ['EMP001','EMP002','EMP003'],
  });
  }
};
