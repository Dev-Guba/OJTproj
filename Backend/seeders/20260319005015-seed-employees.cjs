'use strict';
const brcypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const hashedPassword = await brcypt.hash('superadmin123', 10);

    await queryInterface.bulkInsert('Employees', [
      {
        EmployeeNo: 'EMP001',
        statusId: 1,
        role_id: 1,
        office_id: 1,

        LastName: 'Super',
        FirstName: 'Admin',
        MiddleName: null,
        MiddleInitial: null,
        SuffixName: null,
        TitleSuffix: null,

        SalaryFundingCode: 'LOCAL',
        AppointmentStatusCode: 'REG',

        DateHired: now,
        DateOfAppointment: now,
        DateFinish: null,
        DateOfClearance: null,

        Category: 'A',
        PayrollTerms: 'M',
        PayrollMode: 'B',
        ConfidentialityLevel: 'H',

        GroupCode: 'GRP1',
        Division: 'DIV1',
        Section: 'SEC1',
        Position: 'Manager',
        OfficialPosition: 'System Administrator',

        MonthlyGrade: 24,
        MonthlyStep: 1,

        RATA: 'YES',
        ADCOM: 0,
        PERA: 2000,
        TransAllowance: 1000,

        MonthlyRate: 50000,
        DailyRate: 2000,
        RateDivisior: 22,

        Birthday: now,
        Age: 30,
        BirthPlace: 'Bataan',
        Gender: 'M',
        CivilStatus: 'Single',
        Citizenship: 'Filipino',
        Religion: 'None',
        Ethnicity: 'N/A',
        BloodType: 'O+',

        Height: '170cm',
        Weight: '65kg',

        Email: 'superadmin@icto.com',
        Password: hashedPassword,

        CellNo: '09123456789',
        PhoneNo: null,
        PhoneNo1: null,
        TelNo: null,

        StreetNo: null,
        StreetNo1: null,
        HouseNo: null,
        HouseNo1: null,

        Village: null,
        Village1: null,

        Barangay: 'Bagac',
        Barangay1: null,

        CityTown: 'Bagac',
        CityTown1: null,

        Province: 'Bataan',
        Province1: null,

        Region: 3,
        Region1: null,

        Country: 'Philippines',

        ZipCode: '2107',
        ZipCode1: null,

        GSISNo: null,
        PhilHealthNo: null,
        PagIbigNo: null,
        TaxIDNo: null,
        SSSNo: null,

        WithGSISNo: false,
        WithPagIbigNo: false,
        WithPhilHealthNo: false,
        WithTaxIDNo: false,

        BankCode: null,
        BankAccountNo: null,

        PolicyNo: null,
        CostCenter: null,

        Retirement: null,
        GovSector: null,
        Plantilla: 'Y',
        Eligibility: null,
        Classification: 'A',
        CareerLevel: 1,

        ProvidentNo: null,
        WithProvidentNo: false,

        DateOfLastPromotion: null,
        AgencyEmpNo: null,

        Detail: null,
        Photo: null,
        Signature: null,
        LMSsignature: null,

        DualType: null,
        Position2: null,
        PositionLatest: null,

        ImdSuprv: null,

        SameDeptCode: 'ICTO',
        SecondSameDeptCode: null,

        CustomPYCode: null,
        CustomTMCode: null,
        TimekeepingID: null,

        CTC: null,
        RACode: null,
        TACode: null,

        SeparationType: null,

        IsDeleted: 0,
        lockPDSflag: 0,
        IsDtrExempted: 0,
        RcvSMSLogs: 1,

        modified_by: null,
        modified_date: null,
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Employees', {
      EmployeeNo: 'EMP001'
    }, {});
  },
};