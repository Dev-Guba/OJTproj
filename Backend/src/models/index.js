import User from "./user.model.js";
import Role from "./role.model.js";
import Record from "./record.model.js";
import Employee from "./employee.model.js";
import Status from "./status.model.js";
import Office from "./office.model.js";

// Role ↔ User
Role.hasMany(User, { foreignKey: "role_id" });
User.belongsTo(Role, { foreignKey: "role_id" });

// User ↔ Employee
User.belongsTo(Employee, {
  foreignKey: "EmployeeNo",
  targetKey: "EmployeeNo",
});
Employee.hasOne(User, {
  foreignKey: "EmployeeNo",
  sourceKey: "EmployeeNo",
});

// Employee ↔ Office
Office.hasMany(Employee, {
  foreignKey: "office_id",
});

Employee.belongsTo(Office, {
  foreignKey: "office_id",
});

Employee.hasMany(Record, {
  foreignKey: "employee_id",
});

Record.belongsTo(Employee, {
  foreignKey: "employee_id",
});

// Export all models
export { User, Role, Record, Status, Employee, Office };