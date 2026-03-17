import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";


const Employee = sequelize.define(
  "Employees",
  {
    
    EmployeeNo: { type: DataTypes.STRING(20), allowNull: false, primaryKey: true },
    role_id: {
      type: DataTypes.INTEGER,
      references: { model: "CPTRoles", key: "role_id" }
    },

    // NAME INFORMATION
    LastName: { type: DataTypes.STRING(50) },
    FirstName: { type: DataTypes.STRING(50) },
    MiddleName: { type: DataTypes.STRING(50) },
    MiddleInitial: { type: DataTypes.STRING(5) },
    SuffixName: { type: DataTypes.STRING(5) },
    TitleSuffix: { type: DataTypes.STRING(20) },

    // EMPLOYEE DETAILS
    EmploymentStatusCode: { type: DataTypes.STRING(20) },
    SalaryFundingCode: { type: DataTypes.STRING(20) },
    AppointmentStatusCode: { type: DataTypes.STRING(20) },
    DateHired: { type: DataTypes.DATE },
    DateOfAppointment: { type: DataTypes.DATE },
    DateFinish: { type: DataTypes.DATE },
    DateOfClearance: { type: DataTypes.DATE },

    Category: { type: DataTypes.CHAR(1) },
    PayrollTerms: { type: DataTypes.CHAR(1) },
    PayrollMode: { type: DataTypes.CHAR(1) },
    ConfidentialityLevel: { type: DataTypes.CHAR(1) },

    GroupCode: { type: DataTypes.STRING(20) },
    Division: { type: DataTypes.STRING(20) },
    Department: { type: DataTypes.STRING(20) },
    Section: { type: DataTypes.STRING(20) },
    Position: { type: DataTypes.STRING(20) },
    OfficialPosition: { type: DataTypes.STRING(150) },

    // SALARY
    MonthlyGrade: { type: DataTypes.INTEGER },
    MonthlyStep: { type: DataTypes.INTEGER },
    RATA: { type: DataTypes.STRING(20) },
    ADCOM: { type: DataTypes.DECIMAL(19,4) },
    PERA: { type: DataTypes.DECIMAL(19,4) },
    TransAllowance: { type: DataTypes.DECIMAL(19,4) },
    MonthlyRate: { type: DataTypes.DECIMAL(19,4) },
    DailyRate: { type: DataTypes.DECIMAL(19,4) },
    RateDivisior: { type: DataTypes.DECIMAL(19,4) },

    // PERSONAL INFO
    Birthday: { type: DataTypes.DATE },
    Age: { type: DataTypes.INTEGER },
    BirthPlace: { type: DataTypes.STRING(150) },
    Gender: { type: DataTypes.CHAR(1) },
    CivilStatus: { type: DataTypes.STRING(10) },
    Citizenship: { type: DataTypes.STRING(50) },
    Religion: { type: DataTypes.STRING(20) },
    Ethnicity: { type: DataTypes.STRING(20) },
    BloodType: { type: DataTypes.STRING(50) },
    Height: { type: DataTypes.STRING(25) },
    Weight: { type: DataTypes.STRING(25) },

    // CONTACT
    Email: { type: DataTypes.STRING(50) },
    CellNo: { type: DataTypes.STRING(50) },
    PhoneNo: { type: DataTypes.STRING(50) },
    PhoneNo1: { type: DataTypes.STRING(50) },
    TelNo: { type: DataTypes.STRING(50) },

    // ADDRESS
    StreetNo: { type: DataTypes.STRING(250) },
    StreetNo1: { type: DataTypes.STRING(250) },
    HouseNo: { type: DataTypes.STRING(250) },
    HouseNo1: { type: DataTypes.STRING(250) },
    Village: { type: DataTypes.STRING(250) },
    Village1: { type: DataTypes.STRING(250) },
    Barangay: { type: DataTypes.STRING(250) },
    Barangay1: { type: DataTypes.STRING(250) },
    CityTown: { type: DataTypes.STRING(250) },
    CityTown1: { type: DataTypes.STRING(250) },
    Province: { type: DataTypes.STRING(250) },
    Province1: { type: DataTypes.STRING(250) },
    Region: { type: DataTypes.TINYINT },
    Region1: { type: DataTypes.TINYINT },
    Country: { type: DataTypes.STRING(250) },
    ZipCode: { type: DataTypes.STRING(15) },
    ZipCode1: { type: DataTypes.STRING(15) },

    // GOVERNMENT NUMBERS
    GSISNo: { type: DataTypes.STRING(50) },
    PhilHealthNo: { type: DataTypes.STRING(50) },
    PagIbigNo: { type: DataTypes.STRING(50) },
    TaxIDNo: { type: DataTypes.STRING(50) },
    SSSNo: { type: DataTypes.STRING(50) },

    // BOOLEAN
    WithGSISNo: { type: DataTypes.BOOLEAN },
    WithPagIbigNo: { type: DataTypes.BOOLEAN },
    WithPhilHealthNo: { type: DataTypes.BOOLEAN },
    WithTaxIDNo: { type: DataTypes.BOOLEAN },

    // BANKING
    BankCode: { type: DataTypes.STRING(25) },
    BankAccountNo: { type: DataTypes.STRING(25) },

    // HR INFO
    PolicyNo: { type: DataTypes.STRING(50) },
    CostCenter: { type: DataTypes.STRING(50) },
    Retirement: { type: DataTypes.DATE },
    GovSector: { type: DataTypes.STRING(50) },
    Plantilla: { type: DataTypes.CHAR(1) },
    Eligibility: { type: DataTypes.STRING(50) },
    Classification: { type: DataTypes.CHAR(1) },
    CareerLevel: { type: DataTypes.INTEGER },
    ProvidentNo: { type: DataTypes.STRING(50) },
    WithProvidentNo: { type: DataTypes.BOOLEAN },
    DateOfLastPromotion: { type: DataTypes.DATE },
    AgencyEmpNo: { type: DataTypes.STRING(50) },

    // MISC
    Detail: { type: DataTypes.TEXT },
    Photo: { type: DataTypes.STRING(200) },
    Signature: { type: DataTypes.STRING(50) },
    LMSsignature: { type: DataTypes.STRING(50) },
    DualType: { type: DataTypes.INTEGER },
    Position2: { type: DataTypes.STRING(50) },
    PositionLatest: { type: DataTypes.INTEGER },
    ImdSuprv: { type: DataTypes.STRING(20) },
    SameDeptCode: { type: DataTypes.STRING(50) },
    SecondSameDeptCode: { type: DataTypes.STRING(50) },
    CustomPYCode: { type: DataTypes.STRING(20) },
    CustomTMCode: { type: DataTypes.STRING(20) },
    TimekeepingID: { type: DataTypes.STRING(20) },
    CTC: { type: DataTypes.STRING(20) },
    RACode: { type: DataTypes.STRING(20) },
    TACode: { type: DataTypes.STRING(20) },
    SeparationType: { type: DataTypes.TINYINT },

    // Audit
    IsDeleted: { type: DataTypes.INTEGER, defaultValue: 0 },
    lockPDSflag: { type: DataTypes.INTEGER, defaultValue: 0 },
    IsDtrExempted: { type: DataTypes.INTEGER, defaultValue: 0 },
    RcvSMSLogs: { type: DataTypes.INTEGER, defaultValue: 1 },
    modified_by: { type: DataTypes.STRING(50) },
    modified_date: { type: DataTypes.DATE }
  },
  {
    tableName: "Employees",
    timestamps: true,
  }
);

export default Employee;