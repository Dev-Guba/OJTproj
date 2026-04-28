import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Employee = sequelize.define(
  "Employees",
  {
    EmployeeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    EmployeeNo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },

    statusId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    role_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    office_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    LastName: { type: DataTypes.STRING(50) },
    FirstName: { type: DataTypes.STRING(50) },
    MiddleName: { type: DataTypes.STRING(50) },
    MiddleInitial: { type: DataTypes.STRING(5) },
    SuffixName: { type: DataTypes.STRING(5) },
    TitleSuffix: { type: DataTypes.STRING(20) },

    SalaryFundingCode: { type: DataTypes.STRING(20) },
    AppointmentStatusCode: { type: DataTypes.STRING(20) },
    DateHired: { type: DataTypes.STRING },
    DateOfAppointment: { type: DataTypes.STRING },
    DateFinish: { type: DataTypes.STRING },
    DateOfClearance: { type: DataTypes.STRING },

    Category: { type: DataTypes.CHAR(1) },
    PayrollTerms: { type: DataTypes.CHAR(1) },
    PayrollMode: { type: DataTypes.CHAR(1) },
    ConfidentialityLevel: { type: DataTypes.CHAR(1) },

    GroupCode: { type: DataTypes.STRING(20) },
    Division: { type: DataTypes.STRING(20) },
    Section: { type: DataTypes.STRING(20) },
    Position: { type: DataTypes.STRING(20) },
    OfficialPosition: { type: DataTypes.STRING(150) },

    MonthlyGrade: { type: DataTypes.INTEGER },
    MonthlyStep: { type: DataTypes.INTEGER },
    RATA: { type: DataTypes.STRING(20) },
    ADCOM: { type: DataTypes.DECIMAL(19, 4) },
    PERA: { type: DataTypes.DECIMAL(19, 4) },
    TransAllowance: { type: DataTypes.DECIMAL(19, 4) },
    MonthlyRate: { type: DataTypes.DECIMAL(19, 4) },
    DailyRate: { type: DataTypes.DECIMAL(19, 4) },
    RateDivisior: { type: DataTypes.DECIMAL(19, 4) },

    Birthday: { type: DataTypes.STRING },
    Age: { type: DataTypes.INTEGER },
    BirthPlace: { type: DataTypes.STRING(150) },
    Gender: { type: DataTypes.CHAR(1) },
    CivilStatus: { type: DataTypes.STRING(50) },
    Citizenship: { type: DataTypes.STRING(50) },
    Religion: { type: DataTypes.STRING(50) },
    Ethnicity: { type: DataTypes.STRING(50) },
    BloodType: { type: DataTypes.STRING(50) },
    Height: { type: DataTypes.STRING(50) },
    Weight: { type: DataTypes.STRING(50) },

    Email: { type: DataTypes.STRING(50) },
    Password: { type: DataTypes.STRING(100) },
    CellNo: { type: DataTypes.STRING(50) },
    PhoneNo: { type: DataTypes.STRING(50) },
    PhoneNo1: { type: DataTypes.STRING(50) },
    TelNo: { type: DataTypes.STRING(50) },

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

    GSISNo: { type: DataTypes.STRING(50) },
    PhilHealthNo: { type: DataTypes.STRING(50) },
    PagIbigNo: { type: DataTypes.STRING(50) },
    TaxIDNo: { type: DataTypes.STRING(50) },
    SSSNo: { type: DataTypes.STRING(50) },

    WithGSISNo: { type: DataTypes.BOOLEAN },
    WithPagIbigNo: { type: DataTypes.BOOLEAN },
    WithPhilHealthNo: { type: DataTypes.BOOLEAN },
    WithTaxIDNo: { type: DataTypes.BOOLEAN },

    BankCode: { type: DataTypes.STRING(25) },
    BankAccountNo: { type: DataTypes.STRING(25) },

    PolicyNo: { type: DataTypes.STRING(50) },
    CostCenter: { type: DataTypes.STRING(50) },
    Retirement: { type: DataTypes.STRING },
    GovSector: { type: DataTypes.STRING(50) },
    Plantilla: { type: DataTypes.CHAR(1) },
    Eligibility: { type: DataTypes.STRING(50) },
    Classification: { type: DataTypes.CHAR(1) },
    CareerLevel: { type: DataTypes.INTEGER },
    ProvidentNo: { type: DataTypes.STRING(50) },
    WithProvidentNo: { type: DataTypes.BOOLEAN },
    DateOfLastPromotion: { type: DataTypes.STRING },
    AgencyEmpNo: { type: DataTypes.STRING(50) },

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
    TimekeepingID: { type: DataTypes.STRING(50) },
    CTC: { type: DataTypes.STRING(50) },
    RACode: { type: DataTypes.STRING(50) },
    TACode: { type: DataTypes.STRING(50) },
    SeparationType: { type: DataTypes.TINYINT },
    IsDeleted: { type: DataTypes.INTEGER },
    lockPDSflag: { type: DataTypes.INTEGER },
    IsDtrExempted: { type: DataTypes.INTEGER },
    RcvSMSLogs: { type: DataTypes.INTEGER },
    createdAt: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.STRING },
  },
  {
    tableName: "Employees",
    timestamps: false,
  }
);

export default Employee;