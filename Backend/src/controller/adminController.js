import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  findEmployeeByEmail,
  getAdmins,
  updateAdminUser,
  deleteAdminUser,
  findAdminById,
  createAdminUser,
  findOfficeByCode,
} from "../services/adminServices.js";

import { ROLES } from "../constants/roles.js";
import { createUserByAdmin } from "../services/adminServices.js";

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

    if (admin.role_id === ROLES.ADMIN) {
      const office = await findOfficeByCode(admin.SameDeptCode);

      if (!office || office.status !== "active") {
        return res.status(403).json({
          message: "Your office is currently inactive. Please contact the system administrator.",
        });
      }
    }

    const payload = {
      userId: admin.EmployeeId,
      roleId: admin.role_id,
      employeeNo: admin.EmployeeNo,
      firstName: admin.FirstName,
      lastName: admin.LastName,
      officeCode: admin.SameDeptCode || null,
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

function isSuperAdmin(req) {
  return req.user?.role_id === 1; // Assuming 1 is SUPER_ADMIN
}

export async function HandlegetAdmins(req, res) {
  try {


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

export async function HandleCreateAdmin(req, res) {
  try {
    if (!isSuperAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    const {
      employeeId,
      email,
      password,
      SameDeptCode,
    } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Please select an employee.",
      });
    }

    if (!email || !password || !SameDeptCode) {
      return res.status(400).json({
        success: false,
        message: "Email, password and office are required.",
      });
    }

    const newAdmin = await createAdminUser({
      employeeId,
      email,
      password,
      SameDeptCode,
    });

    return res.status(201).json({
      success: true,
      message: "Admin created successfully.",
      data: newAdmin,
    });

  } catch (err) {
    console.error("Create admin error:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Server Error",
    });
  }
}

export async function HandleUpdateAdmin(req, res) {
  try {
    if (!isSuperAdmin(req)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const userId = Number(req.params.id);

    if (!Number.isInteger(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid admin id",
      });
    }

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