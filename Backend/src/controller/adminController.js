import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findAdminByEmail } from "../services/adminServices.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const INVALID_MSG = "Invalid email or password";

    const admin = await findAdminByEmail(email);

    
    const dummyHash =
      "$2b$10$CwTycUXWue0Thq9StjUM0uJ8m7YxkYhJv1QzVQ2NQdRrQwQwQwQwQ";
    const hashToCompare = admin?.password || dummyHash;

    const isMatch = await bcrypt.compare(password, hashToCompare);

    if (!admin || !isMatch) {
      return res.status(401).json({ message: INVALID_MSG });
    }

    const token = jwt.sign(
      { id: admin.user_id, role: admin.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Admin login successful",
      token,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
}