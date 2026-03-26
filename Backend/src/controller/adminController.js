import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  findAdminByEmail,
  getAdminUsers,
  updateAdminUser,
  deleteAdminUser,
  findAdminById,
} from "../services/adminServices.js";
import { User } from "../models/index.js";
import { ROLES } from "../constants/roles.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const admin = await findAdminByEmail(email);

    if (!admin) {
      return res.status(404).json({ message: "Account not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const sameDeptCode =
      admin.SameDeptCode ?? admin.Employee?.SameDeptCode ?? null;

    const firstName =
      admin.Employee?.FirstName ?? null;

    const lastName =
      admin.Employee?.LastName ?? null;

    const token = jwt.sign(
      {
        id: admin.user_id,
        role_id: admin.role_id,
        SameDeptCode: sameDeptCode,
        firstName,
        lastName,
        EmployeeId: admin.EmployeeId ?? null,
        EmployeeNo: admin.EmployeeNo ?? null,
      },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "6h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        user_id: admin.user_id,
        email: admin.email,
        role_id: admin.role_id,
        SameDeptCode: sameDeptCode,
        firstName,
        lastName,
        EmployeeId: admin.EmployeeId ?? null,
        EmployeeNo: admin.EmployeeNo ?? null,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
}

export async function getAdmins(req, res) {
  try {
    if (req.user.role_id !== ROLES.SUPER_ADMIN) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const search = req.query.search || "";
    const office = req.query.office || "All";

    const admins = await getAdminUsers({ search, office });

    return res.status(200).json({
      success: true,
      data: admins,
    });
  } catch (err) {
    console.error("Get admins error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

export async function createAdmin(req, res) {
  try {
    if (req.user.role_id !== ROLES.SUPER_ADMIN) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { email, password, SameDeptCode } = req.body;

    if (!SameDeptCode) {
      return res.status(400).json({
        success: false,
        message: "Office is required",
      });
    }

    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already in use",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await User.create({
      email,
      password: hashedPassword,
      SameDeptCode,
      role_id: ROLES.ADMIN,
    });

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: {
        user_id: newAdmin.user_id,
        email: newAdmin.email,
        SameDeptCode: newAdmin.SameDeptCode,
        role_id: newAdmin.role_id,
      },
    });
  } catch (err) {
    console.error("Create admin error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

export async function updateAdmin(req, res) {
  try {
    if (req.user.role_id !== ROLES.SUPER_ADMIN) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const userId = Number(req.params.id);
    const existing = await findAdminById(userId);

    if (!existing || existing.role_id !== ROLES.ADMIN) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const updated = await updateAdminUser(userId, req.body);

    return res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("Update admin error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

export async function deleteAdmin(req, res) {
  try {
    if (req.user.role_id !== ROLES.SUPER_ADMIN) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const userId = Number(req.params.id);
    const existing = await findAdminById(userId);

    if (!existing || existing.role_id !== ROLES.ADMIN) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    await deleteAdminUser(userId);

    return res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (err) {
    console.error("Delete admin error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}