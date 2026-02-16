import { User } from "../model/index.js";
export async function findAdminById(id) {
  return await User.findOne({
    where: {
      user_id: id,
      role_id: 1
    }
  });
}

export async function findAdminByEmail(email) {
  return await User.findOne({
    where: {
      email,       // email from login form
      role_id: 1   // only admin
    }
  });
}