import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Employee = sequelize.define(
  "Employees",
  {
    // ✅ PRIMARY KEY (matches migration)
    EmployeeId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    EmployeeNo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },

    role_id: {
      type: DataTypes.INTEGER,
      references: { model: "CPTRoles", key: "role_id" },
    },

    statusId: {
      type: DataTypes.INTEGER,
      references: { model: "status", key: "statusId" },
    },

    // ✅ ADD THIS (missing before)
    office_id: {
      type: DataTypes.INTEGER,
      references: { model: "Offices", key: "office_id" },
    },

    // ================= NAME =================
    LastName: DataTypes.STRING(50),
    FirstName: DataTypes.STRING(50),
    MiddleName: DataTypes.STRING(50),
    MiddleInitial: DataTypes.STRING(5),
    SuffixName: DataTypes.STRING(5),
    TitleSuffix: DataTypes.STRING(20),

    // ================= EMPLOYEE =================
    SalaryFundingCode: DataTypes.STRING(20),
    AppointmentStatusCode: DataTypes.STRING(20),
    DateHired: DataTypes.DATE,
    DateOfAppointment: DataTypes.DATE,
    DateFinish: DataTypes.DATE,
    DateOfClearance: DataTypes.DATE,

    Category: DataTypes.CHAR(1),
    PayrollTerms: DataTypes.CHAR(1),
    PayrollMode: DataTypes.CHAR(1),
    ConfidentialityLevel: DataTypes.CHAR(1),

    GroupCode: DataTypes.STRING(20),
    Division: DataTypes.STRING(20),
    Section: DataTypes.STRING(20), // ❌ removed Department
    Position: DataTypes.STRING(20),
    OfficialPosition: DataTypes.STRING(150),

    // ================= SALARY =================
    MonthlyGrade: DataTypes.INTEGER,
    MonthlyStep: DataTypes.INTEGER,
    RATA: DataTypes.STRING(20),
    ADCOM: DataTypes.DECIMAL(19, 4),
    PERA: DataTypes.DECIMAL(19, 4),
    TransAllowance: DataTypes.DECIMAL(19, 4),
    MonthlyRate: DataTypes.DECIMAL(19, 4),
    DailyRate: DataTypes.DECIMAL(19, 4),
    RateDivisior: DataTypes.DECIMAL(19, 4),

    // ================= PERSONAL =================
    Birthday: DataTypes.DATE,
    Age: DataTypes.INTEGER,
    BirthPlace: DataTypes.STRING(150),
    Gender: DataTypes.CHAR(1),
    CivilStatus: DataTypes.STRING(10),
    Citizenship: DataTypes.STRING(50),
    Religion: DataTypes.STRING(20),
    Ethnicity: DataTypes.STRING(20),
    BloodType: DataTypes.STRING(50),
    Height: DataTypes.STRING(25),
    Weight: DataTypes.STRING(25),

    // ================= CONTACT =================
    Email: DataTypes.STRING(50),
    Password: DataTypes.STRING(100),
    CellNo: DataTypes.STRING(50),
    PhoneNo: DataTypes.STRING(50),
    PhoneNo1: DataTypes.STRING(50),
    TelNo: DataTypes.STRING(50),

    // ================= ADDRESS =================
    StreetNo: DataTypes.STRING(250),
    StreetNo1: DataTypes.STRING(250),
    HouseNo: DataTypes.STRING(250),
    HouseNo1: DataTypes.STRING(250),
    Village: DataTypes.STRING(250),
    Village1: DataTypes.STRING(250),
    Barangay: DataTypes.STRING(250),
    Barangay1: DataTypes.STRING(250),
    CityTown: DataTypes.STRING(250),
    CityTown1: DataTypes.STRING(250),
    Province: DataTypes.STRING(250),
    Province1: DataTypes.STRING(250),
    Region: DataTypes.TINYINT,
    Region1: DataTypes.TINYINT,
    Country: DataTypes.STRING(250),
    ZipCode: DataTypes.STRING(15),
    ZipCode1: DataTypes.STRING(15),

    // ================= GOVERNMENT =================
    GSISNo: DataTypes.STRING(50),
    PhilHealthNo: DataTypes.STRING(50),
    PagIbigNo: DataTypes.STRING(50),
    TaxIDNo: DataTypes.STRING(50),
    SSSNo: DataTypes.STRING(50),

    WithGSISNo: DataTypes.BOOLEAN,
    WithPagIbigNo: DataTypes.BOOLEAN,
    WithPhilHealthNo: DataTypes.BOOLEAN,
    WithTaxIDNo: DataTypes.BOOLEAN,

    // ================= BANK =================
    BankCode: DataTypes.STRING(25),
    BankAccountNo: DataTypes.STRING(25),

    // ================= HR =================
    PolicyNo: DataTypes.STRING(50),
    CostCenter: DataTypes.STRING(50),
    Retirement: DataTypes.DATE,
    GovSector: DataTypes.STRING(50),
    Plantilla: DataTypes.CHAR(1),
    Eligibility: DataTypes.STRING(50),
    Classification: DataTypes.CHAR(1),
    CareerLevel: DataTypes.INTEGER,
    ProvidentNo: DataTypes.STRING(50),
    WithProvidentNo: DataTypes.BOOLEAN,
    DateOfLastPromotion: DataTypes.DATE,
    AgencyEmpNo: DataTypes.STRING(50),

    // ================= MISC =================
    Detail: DataTypes.TEXT,
    Photo: DataTypes.STRING(200),
    Signature: DataTypes.STRING(50),
    LMSsignature: DataTypes.STRING(50),
    DualType: DataTypes.INTEGER,
    Position2: DataTypes.STRING(50),
    PositionLatest: DataTypes.INTEGER,
    ImdSuprv: DataTypes.STRING(20),
    SameDeptCode: DataTypes.STRING(50),
    SecondSameDeptCode: DataTypes.STRING(50),
    CustomPYCode: DataTypes.STRING(20),
    CustomTMCode: DataTypes.STRING(20),
    TimekeepingID: DataTypes.STRING(20),
    CTC: DataTypes.STRING(20),
    RACode: DataTypes.STRING(20),
    TACode: DataTypes.STRING(20),
    SeparationType: DataTypes.TINYINT,

    // ================= AUDIT =================
    IsDeleted: { type: DataTypes.INTEGER, defaultValue: 0 },
    lockPDSflag: { type: DataTypes.INTEGER, defaultValue: 0 },
    IsDtrExempted: { type: DataTypes.INTEGER, defaultValue: 0 },
    RcvSMSLogs: { type: DataTypes.INTEGER, defaultValue: 1 },
    modified_by: DataTypes.STRING(50),
    modified_date: DataTypes.DATE,
  },
  {
    tableName: "Employees",

    // 🔥 IMPORTANT: match your DB
    timestamps: false, // since you DON'T have createdAt/updatedAt
  }
);

export default Employee;