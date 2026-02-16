import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findAdminByEmail } from "../services/adminServices.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Service function should find admin by email & role_id
    const admin = await findAdminByEmail(email);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log(isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin.user_id, role: admin.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Admin login successful",
      token
    });
  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
}
