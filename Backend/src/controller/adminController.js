import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findAdminByEmail } from "../services/adminServices.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // 1️⃣ Find admin by email
    const admin = await findAdminByEmail(email);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // 2️⃣ Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin.user_id, role_id: admin.role_id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "6h" }
    );

    
    return res.status(200).json({
      message: "Admin login successful",
      token,
      user: {
        user_id: admin.user_id,
        email: admin.email,
        role_id: admin.role_id,
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
}