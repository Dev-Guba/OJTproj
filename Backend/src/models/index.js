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
User.belongsTo(Employee, { foreignKey: "EmployeeNo" });
Employee.hasOne(User, { foreignKey: "EmployeeNo" });

// Export all models
export { User, Role, Record, Status, Employee, Office };