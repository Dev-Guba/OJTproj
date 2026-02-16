import User from "./model.js";
import Role from "./Roles.js";

// Associations
Role.hasMany(User, { foreignKey: "role_id" });
User.belongsTo(Role, { foreignKey: "role_id" });

export { User, Role };
