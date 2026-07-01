import {
  getEmployeesByDept,
  createEmployeeAccount,
  createEmployeeRecord,
  updateEmployeeAccountByNo,
  deleteEmployeeRecord,
} from "../services/employeeServices.js";
import { ROLES } from "../constants/roles.js";

export async function getEmployees(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const availableOnly = String(req.query.availableOnly).toLowerCase() === "true";
    const search = req.query.search || "";

    const deptCode =
      req.user.role_id === ROLES.ADMIN
        ? req.user.SameDeptCode
        : null;

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
    const { EmployeeNo , firstName, lastName, email, password } = req.body;

    if (!EmployeeNo || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "EmployeeNo, email, and password are required",
      });
    }

    const isSuperAdmin = req.user.role_id === ROLES.SUPER_ADMIN;
    const isAdmin = req.user.role_id === ROLES.ADMIN;

    if (!isSuperAdmin && !isAdmin) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const result = await createEmployeeAccount({
      EmployeeNo,
      email,
      password,
      callerRole: req.user.role_id,
      callerDeptCode: req.user.SameDeptCode,
    });

    if (result?.error) {
      const code =
        result.error === "Employee not found"
          ? 404
          : result.error === "This employee already has an account" ||
            result.error === "Email is already in use"
          ? 409
          : 400;

      return res.status(code).json({ success: false, message: result.error });
    }

    return res.status(201).json({
      success: true,
      message: "Employee account created successfully",
      data: result.data,
    });
  } catch (error) {
    console.error("Create employee account error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function createEmployeeController(req, res) {
  try {
    const { EmployeeNo, email, password, firstName, lastName } = req.body;

    if (!EmployeeNo) {
      return res.status(400).json({ success: false, message: "Employee number is required" });
    }

    if (!firstName || !lastName) {
      return res.status(400).json({ success: false, message: "First name and last name are required" });
    }

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const isSuperAdmin = req.user.role_id === ROLES.SUPER_ADMIN;
    const isAdmin = req.user.role_id === ROLES.ADMIN;

    if (!isSuperAdmin && !isAdmin) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const result = await createEmployeeRecord({
      EmployeeNo,
      email,
      password,
      firstName,
      lastName,
      callerRole: req.user.role_id,
      callerDeptCode: req.user.SameDeptCode,
      targetDeptCode: req.body.SameDeptCode,
    });

    if (result?.error) {
      const code = result.error === "Email is already in use" ? 409 : 400;
      return res.status(code).json({ success: false, message: result.error });
    }

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: result.data,
    });
  } catch (error) {
    console.error("Create employee error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function updateEmployeeAccountController(req, res) {
  try {
    const { EmployeeNo } = req.params;
    const { email, password, firstName, lastName } = req.body;

    if (!email && !password && !firstName && !lastName) {
      return res.status(400).json({ success: false, message: "Nothing to update" });
    }

    const isSuperAdmin = req.user.role_id === ROLES.SUPER_ADMIN;
    const isAdmin = req.user.role_id === ROLES.ADMIN;

    if (!isSuperAdmin && !isAdmin) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const result = await updateEmployeeAccountByNo(
      EmployeeNo,
      { email, password, firstName, lastName },
      { callerRole: req.user.role_id, callerDeptCode: req.user.SameDeptCode }
    );

    if (result?.error) {
      const code =
        result.error === "Employee not found" ? 404 :
        result.error === "Email is already in use" ? 409 : 403;
      return res.status(code).json({ success: false, message: result.error });
    }

    return res.status(200).json({
      success: true,
      message: "Account updated successfully",
      data: result.data,
    });
  } catch (error) {
    console.error("Update employee account error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function deleteEmployeeController(req, res) {
  try {
    const { EmployeeNo } = req.params;

    const isSuperAdmin = req.user.role_id === ROLES.SUPER_ADMIN;
    const isAdmin = req.user.role_id === ROLES.ADMIN;

    if (!isSuperAdmin && !isAdmin) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const result = await deleteEmployeeRecord(EmployeeNo, {
      callerRole: req.user.role_id,
      callerDeptCode: req.user.SameDeptCode,
    });

    if (result?.error) {
      const code = result.error === "Employee not found" ? 404 : 403;
      return res.status(code).json({ success: false, message: result.error });
    }

    const message =
      result.data.removed === "full"
        ? "Employee removed successfully."
        : "Employee account access removed. HR record was kept.";

    return res.status(200).json({
      success: true,
      message,
      data: result.data,
    });
  } catch (error) {
    console.error("Delete employee error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}