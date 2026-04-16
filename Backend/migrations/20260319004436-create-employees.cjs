'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
async up (queryInterface, Sequelize) {
/**
* Add altering commands here.
*
* Example:
* await queryInterface.createTable('users', { id: Sequelize.INTEGER });
*/

await queryInterface.createTable('Employees', {
EmployeeId: {
type: Sequelize.INTEGER,
autoIncrement: true,
primaryKey: true,
},
EmployeeNo: {
type: Sequelize.STRING(20),
allowNull: false,
unique: true,
},

statusId : {
type: Sequelize.INTEGER,
references: {
model: "status",
key: "statusId",
},
onUpdate: "CASCADE",
onDelete: "SET NULL"
},

role_id: {
type: Sequelize.INTEGER,
references: {
model: "CPTRoles",
key: "role_id"
},
onUpdate: "CASCADE",
onDelete: "SET NULL"
},

office_id: {
type: Sequelize.INTEGER,
references: {
model: "Offices",
key: "office_id",
},
onUpdate: "CASCADE",
onDelete: "SET NULL"
},

// ===================================
// NAME INFORMATION
// ===================================
LastName: { type: Sequelize.STRING(50) },
FirstName: { type: Sequelize.STRING(50) },
MiddleName: { type: Sequelize.STRING(50) },
MiddleInitial: { type: Sequelize.STRING(5) },
SuffixName: { type: Sequelize.STRING(5) },
TitleSuffix: { type: Sequelize.STRING(20) },


// ===================================
// EMPLOYEE DETAILS
// ===================================
SalaryFundingCode: { type: Sequelize.STRING(20) },
AppointmentStatusCode: { type: Sequelize.STRING(20) },
DateHired: { type: Sequelize.DATE },
DateOfAppointment: { type: Sequelize.DATE },
DateFinish: { type: Sequelize.DATE },
DateOfClearance: { type: Sequelize.DATE },

Category: { type: Sequelize.CHAR(1) },
PayrollTerms: { type: Sequelize.CHAR(1) },
PayrollMode: { type: Sequelize.CHAR(1) },
ConfidentialityLevel: { type: Sequelize.CHAR(1) },

GroupCode: { type: Sequelize.STRING(20) },
Division: { type: Sequelize.STRING(20) },
Section: { type: Sequelize.STRING(20) },
Position: { type: Sequelize.STRING(20) },
OfficialPosition: { type: Sequelize.STRING(150) },

// ====================================
// SALARY INFORMATION
// ====================================
MonthlyGrade: { type: Sequelize.INTEGER },
MonthlyStep: { type: Sequelize.INTEGER },

RATA: { type: Sequelize.STRING(20) },

ADCOM: { type: Sequelize.DECIMAL(19,4) },
PERA: { type: Sequelize.DECIMAL(19,4) },
TransAllowance: { type: Sequelize.DECIMAL(19,4) },

MonthlyRate: { type: Sequelize.DECIMAL(19,4) },
DailyRate: { type: Sequelize.DECIMAL(19,4) },
RateDivisior: { type: Sequelize.DECIMAL(19,4) },

// ====================================
// EMPLOYEE'S PERSONAL INFORMATION
// ====================================
Birthday: { type: Sequelize.DATE },
Age: { type: Sequelize.INTEGER },
BirthPlace: { type: Sequelize.STRING(150) },
Gender: { type: Sequelize.CHAR(1) },
CivilStatus: { type: Sequelize.STRING(10) },
Citizenship: { type: Sequelize.STRING(50) },
Religion: { type: Sequelize.STRING(20) },
Ethnicity: { type: Sequelize.STRING(20) },
BloodType: { type: Sequelize.STRING(50) },

Height: { type: Sequelize.STRING(25) },
Weight: { type: Sequelize.STRING(25) },

// =====================================
// CONTACT INFORMATION
// =====================================
Email: { type: Sequelize.STRING(50) },
Password: {type: Sequelize.STRING(100) },
CellNo: { type: Sequelize.STRING(50) },
PhoneNo: { type: Sequelize.STRING(50) },
PhoneNo1: { type: Sequelize.STRING(50) },
TelNo: { type: Sequelize.STRING(50) },

// =====================================
// ADDRESS
// =====================================

StreetNo : {type : Sequelize.STRING(250)},
StreetNo1: { type: Sequelize.STRING(250) },
HouseNo: { type: Sequelize.STRING(250) },
HouseNo1: { type: Sequelize.STRING(250) },

Village: { type: Sequelize.STRING(250) },
Village1: { type: Sequelize.STRING(250) },

Barangay: { type: Sequelize.STRING(250) },
Barangay1: { type: Sequelize.STRING(250) },

CityTown: { type: Sequelize.STRING(250) },
CityTown1: { type: Sequelize.STRING(250) },

Province: { type: Sequelize.STRING(250) },
Province1: { type: Sequelize.STRING(250) },

Region: { type: Sequelize.TINYINT },
Region1: { type: Sequelize.TINYINT },

Country: { type: Sequelize.STRING(250) },

ZipCode: { type: Sequelize.STRING(15) },
ZipCode1: { type: Sequelize.STRING(15) },

// =====================================
// GOVERNMENT NUMBERS
// =====================================
GSISNo: { type: Sequelize.STRING(50) },
PhilHealthNo: { type: Sequelize.STRING(50) },
PagIbigNo: { type: Sequelize.STRING(50) },
TaxIDNo: { type: Sequelize.STRING(50) },
SSSNo: { type: Sequelize.STRING(50) },

// BOOLEAN ATTRIBUTES
WithGSISNo: { type: Sequelize.BOOLEAN },
WithPagIbigNo: { type: Sequelize.BOOLEAN },
WithPhilHealthNo: { type: Sequelize.BOOLEAN },
WithTaxIDNo: { type: Sequelize.BOOLEAN },


// =====================================
// BANKING
// =====================================
BankCode: { type: Sequelize.STRING(25) },
BankAccountNo: { type: Sequelize.STRING(25) },


// =====================================
// HR INFORMATION
// =====================================
PolicyNo: { type: Sequelize.STRING(50) },
CostCenter: { type: Sequelize.STRING(50) },

Retirement: { type: Sequelize.DATE },
GovSector: { type: Sequelize.STRING(50) },
Plantilla: { type: Sequelize.CHAR(1) },
Eligibility: { type: Sequelize.STRING(50) },
Classification: { type: Sequelize.CHAR(1) },
CareerLevel: { type: Sequelize.INTEGER },

ProvidentNo: { type: Sequelize.STRING(50) },
WithProvidentNo: { type: Sequelize.BOOLEAN },

DateOfLastPromotion: { type: Sequelize.DATE },

AgencyEmpNo: { type: Sequelize.STRING(50) },

// =====================================
// MISC
// =====================================
Detail: { type: Sequelize.TEXT },
Photo: { type: Sequelize.STRING(200) },
Signature: { type: Sequelize.STRING(50) },
LMSsignature: { type: Sequelize.STRING(50) },

DualType: { type: Sequelize.INTEGER },
Position2: { type: Sequelize.STRING(50) },
PositionLatest: { type: Sequelize.INTEGER },

ImdSuprv: { type: Sequelize.STRING(20) },

SameDeptCode: { type: Sequelize.STRING(50) },
SecondSameDeptCode: { type: Sequelize.STRING(50) },

CustomPYCode: { type: Sequelize.STRING(20) },
CustomTMCode: { type: Sequelize.STRING(20) },

TimekeepingID: { type: Sequelize.STRING(20) },

CTC: { type: Sequelize.STRING(20) },
RACode: { type: Sequelize.STRING(20) },
TACode: { type: Sequelize.STRING(20) },

SeparationType: { type: Sequelize.TINYINT },


// Audit / control fields
IsDeleted: { type: Sequelize.INTEGER, defaultValue: 0 },
lockPDSflag: { type: Sequelize.INTEGER, defaultValue: 0 },
IsDtrExempted: { type: Sequelize.INTEGER, defaultValue: 0 },
RcvSMSLogs: { type: Sequelize.INTEGER, defaultValue: 1 },
createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
});

// await queryInterface.addColumn('Employees', 'createdAt',{
// type: Sequelize.DATE,
// allowNull: false,
// defaultValue: Sequelize.literal('GETDATE()')
// });

// await queryInterface.addColumn('Employees', 'updatedAt',{
// type: Sequelize.DATE,
// allowNull: false,
// defaultValue: Sequelize.literal('GETDATE()')
// });
},

async down (queryInterface, Sequelize) {
/**
* Add reverting commands here.
*
* Example:
* await queryInterface.dropTable('users');
*/
await queryInterface.dropTable('Employees');
}
};