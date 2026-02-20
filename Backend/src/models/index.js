import User from "./user.model.js";
import Role from "./role.model.js";
import Record from "./record.model.js";

// Associations
Role.hasMany(User, { foreignKey: "role_id" });
User.belongsTo(Role, { foreignKey: "role_id" });

export { User, Role, Record };