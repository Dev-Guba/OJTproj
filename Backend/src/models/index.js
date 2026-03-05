import User from "./user.model.js";
import Role from "./role.model.js";
import Record from "./record.model.js";
import Employee from "./employee.model.js";
import Status from "./status.model.js"

// Associations
Role.hasMany(User, { foreignKey: "role_id" });
User.belongsTo(Role, { foreignKey: "role_id" });

// Employee associations
Status.hasMany(Employee, {foreignKey: "statusId"});
Employee.belongsTo(Status, {foreignKey: "statusId"});

// one is to many record
Employee.hasMany(Record, { foreignKey: "employeeId" });

export { User, Role, Record, Status, Employee };