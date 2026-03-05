import bcrypt from "bcrypt";
import User from "../models/user.model.js";

export async function seedAdminIfMissing() {
  const email = process.env.DEFAULT_ADMIN_EMAIL;
  const password = process.env.DEFAULT_ADMIN_PASSWORD;
  const roleId = Number(process.env.DEFAULT_ADMIN_ROLE_ID || 1);

  if (!email || !password) {
    console.log("⚠️ DEFAULT_ADMIN_EMAIL or DEFAULT_ADMIN_PASSWORD not set.");
    return;
  }

  const existing = await User.findOne({
    where: { email, role_id: roleId },
  });

  if (existing) {
    console.log("✅ Default admin already exists.");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    email,
    password: hashedPassword,
    role_id: roleId,
  });

  console.log("✅ Default admin created successfully.");
}