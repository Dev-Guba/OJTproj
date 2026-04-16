import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  findEmployeeByEmail,
  getAdmins,
  updateAdminUser,
  deleteAdminUser,
  findAdminById,
  createAdminUser,
} from "../services/adminServices.js";

import { ROLES } from "../constants/roles.js";

/**
 * ================================
 * LOGIN
 * ================================
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const admin = await findEmployeeByEmail(email);

    if (!admin) {
      return res.status(404).json({ message: "Account not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.Password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      userId: admin.EmployeeId,
      roleId: admin.role_id,
      employeeNo: admin.EmployeeNo,
      firstName: admin.FirstName,
      lastName: admin.LastName,
      officeCode: admin.Office?.code || null,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "6h" }
    );

    const roleLabel =
      admin.role_id === ROLES.SUPER_ADMIN ? "Super Admin" : "Admin";

    return res.status(200).json({
      success: true,
      message: `Login successful - Welcome ${roleLabel}`,
      token,
      user: payload,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

/**
 * ================================
 * ROLE GUARD (helper inside file)
 * ================================
 */
function isSuperAdmin(req) {
  return req.user?.role_id === ROLES.SUPER_ADMIN;
}

/**
 * ================================
 * GET ADMINS
 * ================================
 */
export async function HandlegetAdmins(req, res) {
  try {
    if (!isSuperAdmin(req)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const admins = await getAdmins({
      search: req.query.search || "",
      office: req.query.office || "All",
    });

    return res.status(200).json({
      success: true,
      message: "Admins retrieved successfully",
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

/**
 * ================================
 * CREATE ADMIN
 * ================================
 */
export async function HandleCreateAdmin(req, res) {
  try {
    if (!isSuperAdmin(req)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { email, password, SameDeptCode } = req.body;

    if (!SameDeptCode) {
      return res.status(400).json({
        success: false,
        message: "Office is required",
      });
    }

    const newAdmin = await createAdminUser({
      email,
      password,
      SameDeptCode,
    });

    if (!newAdmin) {
      return res.status(409).json({
        success: false,
        message: "Email is already in use",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: newAdmin,
    });
  } catch (err) {
    console.error("Create admin error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

/**
 * ================================
 * UPDATE ADMIN
 * ================================
 */
export async function HandleUpdateAdmin(req, res) {
  try {
    if (!isSuperAdmin(req)) {
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

/**
 * ================================
 * DELETE ADMIN
 * ================================
 */
export async function HandleDeleteAdmin(req, res) {
  try {
    if (!isSuperAdmin(req)) {
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