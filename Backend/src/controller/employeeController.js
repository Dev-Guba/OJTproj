import {
  getEmployeesByDept,
  createEmployeeAccount,
} from "../services/employeeServices.js";
import { ROLES } from "../constants/roles.js";

export async function getEmployees(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const availableOnly = String(req.query.availableOnly).toLowerCase() === "true";
    const search = req.query.search || "";

    let deptCode = null;

    if (req.user.role_id === ROLES.SUPER_ADMIN) {
      deptCode = req.query.deptCode || null;
    } else {
      if (!req.user.SameDeptCode) {
        return res.status(403).json({
          message: "User has no department assigned.",
        });
      }

      deptCode = req.user.SameDeptCode;
    }

    const result = await getEmployeesByDept(deptCode, page, limit, {
      availableOnly,
      search,
    });

    res.json(result);
  } catch (error) {
    console.error("Get employees error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function createEmployeeAccountController(req, res) {
  try {
    const { EmployeeNo, email, password } = req.body;

    if (!EmployeeNo || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "EmployeeNo, email, and password are required",
      });
    }

    const isSuperAdmin = req.user.role_id === ROLES.SUPER_ADMIN;
    const isAdmin = req.user.role_id === ROLES.ADMIN;

    if (!isSuperAdmin && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    const result = await createEmployeeAccount({
      EmployeeNo,
      email,
      password,
    });

    if (result?.error) {
      const code =
        result.error === "Employee not found"
          ? 404
          : result.error === "This employee already has an account" ||
            result.error === "Email is already in use"
          ? 409
          : 400;

      return res.status(code).json({
        success: false,
        message: result.error,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Employee account created successfully",
      data: result.data,
    });
  } catch (error) {
    console.error("Create employee account error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}